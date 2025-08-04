
export interface ApiResponse<T> {
    data: T | null;
    message: string;
    status_code: number;
}