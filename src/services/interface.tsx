export interface initState<T> {
    data: T;
    loading: boolean;
    error: string | null;
    status: number | null;
}
