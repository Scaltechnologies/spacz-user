import { Config } from '@/constants/config';

/**
 * Centralized API abstraction. Mock services use `mockDelay` to simulate
 * network latency without making real network calls. When the real backend
 * is ready, `request` becomes the fetch/axios wrapper every service imports
 * instead of returning mock data directly — screens/hooks/services never change.
 */
export function mockDelay<T>(data: T, ms: number = Config.mockNetworkDelayMs): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

const baseUrl = Config.apiBaseUrl;

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!baseUrl) {
    throw new Error('API base URL is not configured. This app is currently running on mock data.');
  }
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
