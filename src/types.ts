export interface QueryData {
  [key: string]: string | null | undefined;
}

export interface ApiResponse {
  code?: number;
  msg?: string;
  data?: QueryData;
}

export interface FieldGroup {
  id: string;
  title: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
  icon: string;
  keys: string[];
}

export type ThemeMode = 'auto' | 'light' | 'dark';
export type StatusType = 'info' | 'ok' | 'err';
export type ToastType = 'success' | 'error';
