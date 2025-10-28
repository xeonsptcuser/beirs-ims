export interface BaseResponse<T> {
  status_code: string;
  message: string;
  data: T;
  timestamp: string;
  error_response: ErrorItem[] | null;
}

interface ErrorItem {
  error_code: string;
  localized_message: string;
}
