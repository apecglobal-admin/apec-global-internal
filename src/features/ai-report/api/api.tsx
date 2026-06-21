import axios from "axios";
import { formatDateTime } from "@/src/utils/formatDate";
import type {
  AIReportAnalysisResponse,
  AIReportResponse,
  AIReportReviewOptions,
  AIReportSelectOption,
} from "@/src/features/ai-report/types";
import apiAxiosInstance from "@/src/services/axios";

interface AudioTranscriptionResponse {
  text: string;
}

type JsonRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const unwrapArray = (value: unknown): unknown[] => {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) return current;
    if (!isRecord(current)) return [];
    current = current.data;
  }

  return [];
};

const normalizeReviewOptions = (value: unknown): AIReportSelectOption[] =>
  unwrapArray(value).flatMap((item) => {
    if (!isRecord(item)) return [];

    const id = Number(item.id);
    const nameCandidates = [item.name, item.label, item.title];
    const name = nameCandidates.find(
      (candidate): candidate is string =>
        typeof candidate === "string" && candidate.trim().length > 0,
    );

    return Number.isInteger(id) && id > 0 && name ? [{ id, name }] : [];
  });

const normalizeVietnameseText = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

const isNamThienLongReport = (text: string): boolean => {
  const normalizedText = normalizeVietnameseText(text);
  return (
    normalizedText.includes("nam thien long") ||
    (normalizedText.includes("khu vuc") && normalizedText.includes("quan so"))
  );
};

export const sendAudioToGemini = async (
  audioBlob: Blob,
  context: string,
): Promise<AudioTranscriptionResponse> => {
  const formData = new FormData();
  formData.append("audio", audioBlob);
  formData.append("context", context);

  const response = await axios.post<AudioTranscriptionResponse>(
    "/api/gemini",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const loadAIReportProjectOptions = async (
  token: string,
  companyIds: number[],
): Promise<AIReportSelectOption[]> => {
  const response = await apiAxiosInstance.get<unknown>(
    "/projects/select/option",
    {
      params: {
        companies: companyIds.length > 0 ? companyIds.join(",") : null,
      },
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return normalizeReviewOptions(response.data);
};

export const loadAIReportReviewOptions = async (
  token: string,
): Promise<AIReportReviewOptions> => {
  const requestConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [taskTypes, priorities, companies, projects, kpiItems] =
    await Promise.all([
      apiAxiosInstance.get<unknown>(
        "/cms/select/options/type_tasks",
        requestConfig,
      ),
      apiAxiosInstance.get<unknown>(
        "/cms/select/options/project_priorities",
        requestConfig,
      ),
      apiAxiosInstance.get<unknown>("/tasks/companies/select", requestConfig),
      loadAIReportProjectOptions(token, []),
      apiAxiosInstance.get<unknown>("/kpi/items/tasks/select", requestConfig),
    ]);

  return {
    taskTypes: normalizeReviewOptions(taskTypes.data),
    priorities: normalizeReviewOptions(priorities.data),
    companies: normalizeReviewOptions(companies.data),
    projects,
    kpiItems: normalizeReviewOptions(kpiItems.data),
  };
};

export const formatReport = async (
  text: string,
  userName: string,
  token: string,
) => {
  if (isNamThienLongReport(text)) {
    return axios.post<AIReportAnalysisResponse>("/api/webhook", {
      text,
      userName,
      token,
      timestamp: formatDateTime(new Date()),
    });
  }

  return axios.post<AIReportAnalysisResponse>("/api/ai-report", {
    text,
    userName,
    token,
  });
};

export const saveReport = async (
  data: Extract<AIReportResponse, { report_project: "ntl" }>,
  userName: string,
  email: string,
  department: string,
  position: string,
) => {
  return axios.post("/api/webhook/save", {
    reports: data,
    userName,
    email,
    department,
    position,
    timestamp: formatDateTime(new Date()),
  });
};
