export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
}

export type AspiringCategory = 'Groups' | 'Banking' | 'DSE' | 'SSC' | 'Railways';

export const ASPIRING_CATEGORIES: AspiringCategory[] = ['Groups', 'Banking', 'DSE', 'SSC', 'Railways'];
