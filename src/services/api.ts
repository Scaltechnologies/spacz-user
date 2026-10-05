import { Config } from '@/constants/config';
import { getItem, removeItem, setItem, StorageKeys } from '@/utils/storage';

/**
 * Centralized HTTP client. Every call goes through the SPACZ gateway
 * (EXPO_PUBLIC_API_BASE_URL) and carries `Authorization: Bearer <accessToken>`.
 * On 401 the refresh token is exchanged once (single-flight, as required by
 * auth-service: refresh tokens are single-use) and the request is retried.
 */

/** Standard error body returned by every SPACZ service and the gateway. */
export interface ApiFieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  code: string;
  fieldErrors: ApiFieldError[];
  correlationId?: string;

  constructor(status: number, code: string, message: string, fieldErrors: ApiFieldError[] = [], correlationId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.correlationId = correlationId;
  }
}

export interface Session {
  accessToken: string;
  refreshToken: string;
}

let session: Session | null = null;
let refreshing: Promise<boolean> | null = null;
let onSessionExpired: (() => void) | null = null;

export async function loadSession(): Promise<Session | null> {
  const [accessToken, refreshToken] = await Promise.all([
    getItem(StorageKeys.authToken),
    getItem(StorageKeys.refreshToken),
  ]);
  session = accessToken && refreshToken ? { accessToken, refreshToken } : null;
  return session;
}

export async function setSession(next: Session): Promise<void> {
  session = next;
  await Promise.all([
    setItem(StorageKeys.authToken, next.accessToken),
    setItem(StorageKeys.refreshToken, next.refreshToken),
  ]);
}

export async function clearSession(): Promise<void> {
  session = null;
  await Promise.all([removeItem(StorageKeys.authToken), removeItem(StorageKeys.refreshToken)]);
}

export function getSession(): Session | null {
  return session;
}

/** Called when the refresh token is rejected, so the auth store can sign the user out. */
export function setSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler;
}

type QueryValue = string | number | boolean | null | undefined | (string | number)[];

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** JSON-serialised, or sent as-is when it is FormData (multipart upload). */
  /** Send the bearer token (default true). */
  auth?: boolean;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const params: string[] = [];
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    const encoded = Array.isArray(value) ? value.join(',') : String(value);
    if (Array.isArray(value) && value.length === 0) return;
    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(encoded)}`);
  });
  return `${Config.apiBaseUrl}${path}${params.length ? `?${params.join('&')}` : ''}`;
}

async function toApiError(response: Response): Promise<ApiError> {
  try {
    const body = await response.json();
    return new ApiError(
      body.status ?? response.status,
      body.error ?? 'ERROR',
      body.message ?? `Request failed (${response.status})`,
      body.fieldErrors ?? [],
      body.correlationId
    );
  } catch {
    return new ApiError(response.status, 'ERROR', `Request failed (${response.status})`);
  }
}

async function send(path: string, options: RequestOptions): Promise<Response> {
  if (!Config.apiBaseUrl) {
    throw new ApiError(0, 'CONFIG_ERROR', 'API base URL is not configured (EXPO_PUBLIC_API_BASE_URL).');
  }
  const isMultipart = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = { Accept: 'application/json' };
  // For FormData the runtime sets the multipart Content-Type with its boundary.
  if (options.body !== undefined && !isMultipart) headers['Content-Type'] = 'application/json';
  if (options.auth !== false && session) headers.Authorization = `Bearer ${session.accessToken}`;
  const method = options.method ?? 'GET';
  const url = buildUrl(path, options.query);
  const startedAt = Date.now();
  // Development logging: method, URL, status and timing only — never headers, tokens or bodies.
  if (__DEV__) console.log(`[API REQUEST] ${method} ${url}${isMultipart ? ' (multipart)' : ''}`);
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body:
        options.body === undefined ? undefined : isMultipart ? (options.body as FormData) : JSON.stringify(options.body),
    });
  } catch (err) {
    throw toTransportError(err, method, url);
  }
  if (__DEV__) console.log(`[API RESPONSE] ${method} ${url} → ${response.status} (${Date.now() - startedAt}ms)`);
  return response;
}

const NETWORK_FAILURE = /network request failed|failed to fetch|failed to connect|connect(ion)? (refused|reset|timed out)|unable to resolve host|timeout|timed out|unreachable|ECONN|ENOTFOUND|EHOSTUNREACH|socket/i;

/**
 * fetch() itself threw, so no HTTP response exists. Only genuine connectivity failures are reported
 * as "Unable to reach the server"; anything else (e.g. the request body could not be encoded) keeps
 * its real reason so it is not mistaken for a network problem.
 */
function toTransportError(err: unknown, method: string, url: string): ApiError {
  const reason = err instanceof Error ? err.message : String(err);
  if (__DEV__) console.warn(`[API ERROR] ${method} ${url} → no response: ${reason}`);
  if (NETWORK_FAILURE.test(reason)) {
    return new ApiError(
      0,
      'NETWORK_ERROR',
      `Unable to reach the server at ${Config.apiBaseUrl}. Check that your phone is on the same Wi-Fi and the backend is running.${__DEV__ ? ` (${reason})` : ''}`
    );
  }
  return new ApiError(0, 'REQUEST_ERROR', `The request could not be sent: ${reason}`);
}

async function refreshSession(): Promise<boolean> {
  const refreshToken = session?.refreshToken;
  if (!refreshToken) return false;
  try {
    const response = await send('/api/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      auth: false,
    });
    if (!response.ok) return false;
    const body = (await response.json()) as Session;
    await setSession({ accessToken: body.accessToken, refreshToken: body.refreshToken });
    return true;
  } catch {
    return false;
  }
}

/** Sends the request, refreshing the session once on 401; throws ApiError for any non-2xx response. */
async function execute(path: string, options: RequestOptions): Promise<Response> {
  let response = await send(path, options);

  if (response.status === 401 && options.auth !== false && session && !path.startsWith('/api/auth/')) {
    refreshing ??= refreshSession().finally(() => {
      refreshing = null;
    });
    if (await refreshing) {
      response = await send(path, options);
    } else {
      await clearSession();
      onSessionExpired?.();
    }
  }

  if (!response.ok) {
    const error = await toApiError(response);
    // The backend's ApiError body (code, message, correlationId) — it never contains secrets.
    if (__DEV__) {
      console.warn(
        `[API ERROR] ${options.method ?? 'GET'} ${path} → ${response.status} ${error.code}: ${error.message}` +
          (error.correlationId ? ` [${error.correlationId}]` : '')
      );
    }
    throw error;
  }
  return response;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await execute(path, options);
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Downloads an authenticated binary (e.g. a private document image) as a data: URI for display. */
export async function requestDataUri(path: string): Promise<string> {
  const blob = await (await execute(path, {})).blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(new ApiError(0, 'READ_ERROR', 'Could not read the downloaded file'));
    reader.readAsDataURL(blob);
  });
}

/**
 * A user-facing message that keeps the real reason: the backend's message for 4xx, a status-specific
 * message for 413/415 and 5xx, and the transport reason when no response arrived.
 */
export function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Your session has expired. Please log in again.';
    if (err.status === 413) return err.message || 'The file is too large.';
    if (err.status === 415) return 'This file type is not supported.';
    if (err.status === 502 || err.status === 503 || err.status === 504) {
      return `${err.message || 'A backend service is temporarily unavailable'} (HTTP ${err.status}). Please try again.`;
    }
    if (err.status >= 500) return `${fallback} (server error ${err.status})`;
    if (err.fieldErrors.length > 0) {
      return err.fieldErrors.map((item) => `${item.field}: ${item.message}`).join('\n');
    }
    return err.message || fallback;
  }
  return err instanceof Error ? err.message : fallback;
}
