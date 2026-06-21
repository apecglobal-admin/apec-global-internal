import { z } from "zod";

import { AI_REPORT_MAX_REPORTS } from "./types";
import type {
  GenericReportData,
  GenericReportItem,
  TaskReportResult,
} from "./types";

const idSchema = z
  .union([z.string(), z.number()])
  .nullable()
  .transform((value) => (value === null ? null : String(value)));

const optionalIdSchema = z
  .union([z.string(), z.number()])
  .nullable()
  .optional()
  .transform((value) =>
    value === null || value === undefined ? value : String(value),
  );

const reportDataSchema = z
  .object({
    task_name: z.string().trim().min(1).nullable().optional(),
    type_task: z.number().int().positive().nullable().optional(),
    date_start: z.string().nullable().optional(),
    date_end: z.string().nullable().optional(),
    task_priority: z.number().int().positive().nullable().optional(),
    projects: z.array(z.number().int().positive()).nullable().optional(),
    companies: z.array(z.number().int().positive()).nullable().optional(),
    kpi_item_id: z.number().int().positive().nullable().optional(),
    target_type: z.number().int().positive().nullable().optional(),
    target_value: z.number().nonnegative().nullable().optional(),
    min_count_reject: z.number().int().nonnegative().nullable().optional(),
    max_count_reject: z.number().int().nonnegative().nullable().optional(),
    time_repeat: z.string().nullable().optional(),
    progress: z.number().min(0).max(100).nullable().optional(),
    status: z.number().int().min(2).max(5).nullable().optional(),
    achieved_value: z.number().nullable().optional(),
  })
  .strict();

const reportItemSchema = z
  .object({
    action: z.enum(["create", "update_progress"]),
    targetType: z.enum(["personal_task", "subtask"]),
    parent_task_id: idSchema,
    task_assignment_id: optionalIdSchema,
    sub_task_id: optionalIdSchema,
    data: reportDataSchema,
  })
  .strict()
  .superRefine((report, context) => {
    const requiresExistingPersonalTask =
      report.targetType === "personal_task" && report.action !== "create";
    const requiresExistingSubtask =
      report.targetType === "subtask" && report.action !== "create";

    if (requiresExistingPersonalTask && !report.parent_task_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parent_task_id"],
        message: "Nhiệm vụ cha hiện có phải có parent_task_id.",
      });
    }

    if (requiresExistingSubtask && !report.parent_task_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parent_task_id"],
        message: "Nhiệm vụ con cấp 1 phải có parent_task_id.",
      });
    }

    if (requiresExistingSubtask && !report.sub_task_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sub_task_id"],
        message: "Nhiệm vụ con cấp 1 hiện có phải có sub_task_id.",
      });
    }

    if (report.action === "update_progress" && !report.task_assignment_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["task_assignment_id"],
        message: "Cập nhật tiến độ phải có task_assignment_id.",
      });
    }

    if (report.action === "update_progress") {
      const metadataFields = [
        "task_name",
        "type_task",
        "date_start",
        "date_end",
        "task_priority",
        "projects",
        "companies",
        "kpi_item_id",
        "target_type",
        "target_value",
        "min_count_reject",
        "max_count_reject",
        "time_repeat",
      ] as const;
      const invalidField = metadataFields.find(
        (field) => report.data[field] != null,
      );

      if (invalidField) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["data", invalidField],
          message:
            "Cập nhật báo cáo chỉ được thay đổi tiến độ, kết quả hoặc trạng thái.",
        });
      }
    }
  });

const taskReportResultSchema = z
  .object({
    report_project: z.literal("other"),
    reports: z.array(reportItemSchema).min(1).max(AI_REPORT_MAX_REPORTS),
  })
  .strict();

const emptyCreateReviewData: Required<GenericReportData> = {
  task_name: null,
  type_task: null,
  date_start: null,
  date_end: null,
  task_priority: null,
  projects: null,
  companies: null,
  kpi_item_id: null,
  target_type: null,
  target_value: null,
  min_count_reject: null,
  max_count_reject: null,
  time_repeat: null,
  progress: null,
  status: null,
  achieved_value: null,
};

const emptyProgressReviewData = {
  progress: null,
  status: null,
  achieved_value: null,
} satisfies Pick<
  Required<GenericReportData>,
  "progress" | "status" | "achieved_value"
>;

const normalizeReport = (
  report: GenericReportItem,
): GenericReportItem => {
  const data =
    report.action === "create"
      ? {
          ...emptyCreateReviewData,
          ...report.data,
          task_name: report.data.task_name ?? null,
        }
      : report.action === "update_progress"
        ? { ...emptyProgressReviewData, ...report.data }
        : { ...report.data };

  if (data.status === 4 || data.progress === 100) {
    data.status = 4;
    data.progress = 100;
  } else if (
    data.progress != null &&
    data.progress < 100 &&
    data.status === 4
  ) {
    data.status = 2;
  }

  if (report.targetType === "personal_task" && report.action === "create") {
    return {
      ...report,
      parent_task_id: null,
      task_assignment_id: null,
      sub_task_id: null,
      data,
    };
  }

  if (report.targetType === "subtask" && report.action === "create") {
    return { ...report, sub_task_id: null, data };
  }

  return { ...report, data };
};

export const parseTaskAnalysis = (
  input: unknown,
): TaskReportResult => {
  const parsed = taskReportResultSchema.parse(input);

  return {
    report_project: "other",
    reports: parsed.reports.map(normalizeReport),
  };
};
