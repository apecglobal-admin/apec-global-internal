export interface initState<T> {
    data: T;
    loading: boolean;
    error: string | null;
    status: number | null;
}
export type RecordType = "full" | "lack" | "unpaid_leave" | "overtime" | "absent";

export interface DayRecord {
  date: number;
  type: RecordType;
  checkIn?: string;
  checkOut?: string;
  shiftName?: string;
  score?: number;
  diMuon?: number;
  veSom?: number;
  lamThemTong?: number;
  lamThemLuong?: number;
  lamThemNghi?: number;
  nghiDiCongTac?: number;
}



export const DOW_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
export const DOW_FULL   = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
export const MONTH_LABELS = ["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"];

export const TYPE_COLOR: Record<RecordType, string> = {
  full:         "#22c55e",
  lack:         "#f97316",
  unpaid_leave: "#9ca3af",
  overtime:     "#3b82f6",
  absent:       "#ef4444",
};

export const TYPE_LABEL: Record<RecordType, string> = {
  full:         "+",
  lack:         "-",
  unpaid_leave: "NKL",
  overtime:     "OT",
  absent:       "V",
};

export const TYPE_NAME: Record<RecordType, string> = {
  full:         "Đủ công",
  lack:         "Thiếu công",
  unpaid_leave: "Nghỉ KL",
  overtime:     "Làm thêm",
  absent:       "Vắng",
};

export const LEGEND_ITEMS = [
  { color: "#22c55e", label: "Đủ công" },
  { color: "#f97316", label: "Thiếu công" },
  { color: "#9ca3af", label: "Nghỉ không lương" },
  { color: "#3b82f6", label: "OT Làm thêm giờ" },
];



interface TaskLog {
    id: number;
    reject_date: string | null;
    completed_date: string | null;
    reason: string | null;
    date_end: string | null;
    prove: string | null;
}

interface TaskDetail {
    id: number;
    name: string;
    description: string | null;
    process: number;
    date_start: string;
    date_end: string;
}

interface Status {
    id: number;
    name: string;
}

interface Priority {
    id: number;
    name: string;
    weight: number;
}

interface Project {
    id: number;
    name: string;
}

interface KPIItem {
    id: number;
    name: string;
}

interface Type {
    id: number;
    name: string;
}

interface TargetType {
    id: number;
    name: string;
}

export interface Unit{
    id: number;
    name: string;
}

export interface Task {
    id: string;
    employee_id: string;

    prove: string | null;
    checked: boolean;
    exp_increase: number | string;

    process: number;
    target_value: string;
    value: string;

    reject_status: boolean;
    last_reject_date: any;

    completed_date: string;
    is_overdue: boolean,
    is_due: boolean,

    task_logs: TaskLog[];

    task: TaskDetail;

    status: Status;

    priority: Priority;

    project: Project;

    kpi_item: KPIItem;

    type: Type;

    target_type: TargetType;
    units: Unit
}

