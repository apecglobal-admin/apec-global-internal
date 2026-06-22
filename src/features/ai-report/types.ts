export interface NTLReportItem {
  report_date: string;
  area: string;
  new_customers_opened: string;
  customers_closed_withdrawn: string;
  positions_increased: string;
  positions_decreased: string;
  customer_feedback_incidents: string;
  notes: string;
  actual_vs_contracted_staff: string;
  new_staff_hired: string;
  staff_resigned: string;
  staff_violations: string;
  staff_suggestions_feedback: string;
}

export const AI_REPORT_MAX_REPORTS = 20;

export type TaskReportAction = "create" | "update_progress";

export type TaskReportTarget = "personal_task" | "subtask";

export interface GenericReportData {
  task_name?: string | null;
  type_task?: number | null;
  date_start?: string | null;
  date_end?: string | null;
  task_priority?: number | null;
  projects?: number[] | null;
  companies?: number[] | null;
  kpi_item_id?: number | null;
  target_type?: number | null;
  target_value?: number | null;
  min_count_reject?: number | null;
  max_count_reject?: number | null;
  time_repeat?: string | null;
  progress?: number | null;
  status?: number | null;
  achieved_value?: number | null;
}

export interface AIReportSelectOption {
  id: number;
  name: string;
}

export interface AIReportReviewOptions {
  taskTypes: AIReportSelectOption[];
  priorities: AIReportSelectOption[];
  companies: AIReportSelectOption[];
  projects: AIReportSelectOption[];
  kpiItems: AIReportSelectOption[];
}

export interface GenericReportItem {
  action: TaskReportAction;
  targetType: TaskReportTarget;
  parent_task_id: string | null;
  task_assignment_id?: string | null;
  sub_task_id?: string | null;
  data: GenericReportData;
}

export interface TaskReportResult {
  report_project: "other";
  reports: GenericReportItem[];
}

export type AIReportResponse =
  | { report_project: "ntl"; reports: NTLReportItem[] }
  | TaskReportResult;

export type AIReportAnalysisResponse = AIReportResponse;

export interface AIReportParentTask {
  id: string | number;
  employee_id?: string | number;
  process?: number;
  value?: string | number;
  target_value?: string | number;
  is_overdue?: boolean;
  task?: {
    id?: string | number;
    name?: string;
    date_start?: string;
    date_end?: string;
  };
  status?: {
    id?: string | number;
    name?: string;
  };
  priority?: {
    id?: string | number;
    name?: string;
  };
  projects?: Array<{ id: string | number; name: string }>;
  companies?: Array<{ id: string | number; name: string }>;
  kpi_item?: { id?: string | number; name?: string };
  type?: { id?: string | number; name?: string };
  units?: { id?: string | number; name?: string };
  created_by?: { id?: string | number; name?: string };
}

export interface TaskOperationResult {
  reportIndex: number;
  success: boolean;
  message: string;
}
