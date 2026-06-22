import type { TaskReportResult } from "../types";

type JsonRecord = Record<string, unknown>;

export interface AISubtaskContext {
  id: number;
  name: string;
}

export interface AIParentTaskContext {
  id: number;
  task_assignment_id: number;
  name: string;
  project_name: string;
  units_name: string;
  subtasks: AISubtaskContext[];
}

export interface AITaskContext {
  tasks: AIParentTaskContext[];
}

const ACTIVE_TASK_STATUS = 2;

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readRecord = (value: unknown): JsonRecord => (isRecord(value) ? value : {});

const readString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const readNumber = (value: unknown, fallback = 0): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = readNumber(value, Number.NaN);
  return Number.isFinite(parsed) ? parsed : null;
};

const readStatusId = (value: unknown): number | null => {
  const status = readRecord(value);
  return readNullableNumber(status.id ?? value);
};

const unwrapArray = (value: unknown): unknown[] => {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) return current;
    if (!isRecord(current)) return [];
    current = current.data;
  }

  return [];
};

const readEntityName = (value: unknown): string => {
  const entity = readRecord(value);
  return (
    readString(entity.name) ||
    readString(entity.label) ||
    readString(entity.title)
  );
};

const buildBackendUrl = (path: string, params?: URLSearchParams): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL chưa được cấu hình.");
  }

  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const url = new URL(`api/v1${path}`, normalizedBaseUrl);
  if (params) url.search = params.toString();
  return url.toString();
};

const fetchBackendJson = async (
  path: string,
  token: string,
  params?: URLSearchParams,
): Promise<unknown> => {
  const response = await fetch(buildBackendUrl(path, params), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const errorPayload = readRecord(payload);
    const message =
      readString(errorPayload.message) ||
      `Backend trả về HTTP ${response.status} khi tải ${path}.`;
    throw new Error(message);
  }

  return payload;
};

const normalizeSubtask = (value: unknown): AISubtaskContext | null => {
  const subtask = readRecord(value);
  const statusId = readStatusId(subtask.subtask_status ?? subtask.status);
  const id = readNumber(subtask.id, Number.NaN);
  const name = readString(subtask.name);

  if (!Number.isFinite(id) || !name || statusId !== ACTIVE_TASK_STATUS) {
    return null;
  }

  return { id, name };
};

const loadSubtasks = async (
  taskAssignmentId: number,
  token: string,
): Promise<AISubtaskContext[]> => {
  const params = new URLSearchParams({
    limit: "1000",
    offset: "0",
    task_assignment_id: String(taskAssignmentId),
    subtask_status: String(ACTIVE_TASK_STATUS),
  });
  const payload = await fetchBackendJson("/tasks/sub", token, params);

  return unwrapArray(payload).flatMap((item) => {
    const subtask = normalizeSubtask(item);
    return subtask ? [subtask] : [];
  });
};

const loadSubtasksWithLimit = async (
  taskAssignmentIds: number[],
  token: string,
  concurrency = 5,
): Promise<Map<number, AISubtaskContext[]>> => {
  const result = new Map<number, AISubtaskContext[]>();

  for (let index = 0; index < taskAssignmentIds.length; index += concurrency) {
    const batch = taskAssignmentIds.slice(index, index + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (taskAssignmentId) => ({
        taskAssignmentId,
        subtasks: await loadSubtasks(taskAssignmentId, token),
      })),
    );

    batchResults.forEach(({ taskAssignmentId, subtasks }) => {
      result.set(taskAssignmentId, subtasks);
    });
  }

  return result;
};

const normalizeParentTask = (
  value: unknown,
  subtasks: AISubtaskContext[],
): AIParentTaskContext | null => {
  const assignment = readRecord(value);
  const task = readRecord(assignment.task);
  const units = readRecord(assignment.units);
  const taskId = readNumber(task.id, Number.NaN);
  const taskAssignmentId = readNumber(assignment.id, Number.NaN);
  const name = readString(task.name);
  const taskStatus = readStatusId(
    assignment.status ?? assignment.task_status ?? task.status,
  );

  if (
    !Number.isFinite(taskId) ||
    !Number.isFinite(taskAssignmentId) ||
    !name ||
    taskStatus !== ACTIVE_TASK_STATUS
  ) {
    return null;
  }

  const projectName =
    readEntityName(assignment.project) ||
    readEntityName(unwrapArray(assignment.projects)[0]);

  return {
    id: taskId,
    task_assignment_id: taskAssignmentId,
    name,
    project_name: projectName,
    units_name: readString(units.name) || "%",
    subtasks,
  };
};

export const loadAITaskContext = async (
  token: string,
): Promise<AITaskContext> => {
  const taskParams = new URLSearchParams({
    page: "1",
    limit: "1000",
    statusFilter: String(ACTIVE_TASK_STATUS),
  });
  const taskPayload = await fetchBackendJson(
    "/profile/tasks",
    token,
    taskParams,
  );

  const activeTasks = unwrapArray(taskPayload).filter((item) => {
    const assignment = readRecord(item);
    const task = readRecord(assignment.task);
    return (
      readStatusId(assignment.status ?? assignment.task_status ?? task.status) ===
      ACTIVE_TASK_STATUS
    );
  });
  const assignmentIds = activeTasks.flatMap((item) => {
    const id = readNullableNumber(readRecord(item).id);
    return id === null ? [] : [id];
  });
  const subtasksByAssignment = await loadSubtasksWithLimit(assignmentIds, token);
  const tasks = activeTasks.flatMap((item) => {
    const assignmentId = readNullableNumber(readRecord(item).id);
    const task = normalizeParentTask(
      item,
      assignmentId === null ? [] : subtasksByAssignment.get(assignmentId) ?? [],
    );
    return task ? [task] : [];
  });

  return { tasks };
};

export const validateTaskAnalysisContext = (
  analysis: TaskReportResult,
  context: AITaskContext,
): void => {
  for (const report of analysis.reports) {
    if (report.targetType === "personal_task" && report.action === "create") {
      continue;
    }

    if (
      report.targetType === "subtask" &&
      report.action === "create" &&
      (!report.parent_task_id || !report.task_assignment_id)
    ) {
      continue;
    }

    const parentTask = context.tasks.find(
      (task) =>
        String(task.id) === String(report.parent_task_id) &&
        (!report.task_assignment_id ||
          String(task.task_assignment_id) === String(report.task_assignment_id)),
    );
    if (!parentTask) {
      throw new Error("Gemini trả về parent task không tồn tại trong ngữ cảnh.");
    }

    if (report.targetType === "subtask" && report.action !== "create") {
      const subtaskExists = parentTask.subtasks.some(
        (subtask) => String(subtask.id) === String(report.sub_task_id),
      );
      if (!subtaskExists) {
        throw new Error("Gemini trả về subtask không tồn tại trong ngữ cảnh.");
      }
    }
  }
};
