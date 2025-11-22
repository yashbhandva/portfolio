export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  errorCode?: string;
  success: boolean;
}

export function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
  return response.status === 'success';
}