export interface initState<T> {
    data: T;
    loading: boolean;
    error: string | null;
    status: number | null;
}


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

interface Unit{
    id: number;
    name: string;
}

export interface Task {
    id: string;
    employee_id: string;

    prove: string | null;
    checked: boolean;

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

