import axios, { type AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export class ApiRequestError extends Error {
  status: number;
  // Present only for validation errors (400s from @Valid failures) — maps
  // field name to its specific message, e.g. { name: "must not be blank" }.
  // Optional and additive: existing callers that only read `.message` keep
  // working unchanged; this is here for any consumer that wants per-field
  // detail instead of (or alongside) the joined summary string.
  fieldErrors?: Record<string, string>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.name = "ApiRequestError";
  }
}

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
}

interface ApiErrorBody {
  message?: string;
  fieldErrors?: Record<string, string>;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  try {
    const response = await httpClient.request<T>({
      url: path,
      method: options.method ?? "GET",
      data: options.body,
      headers: options.token ? { Authorization: `Bearer ${options.token}` } : undefined,
    });

    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorBody>;

    if (axiosError.response) {
      const message =
        axiosError.response.data?.message ?? `Request failed with status ${axiosError.response.status}`;
      throw new ApiRequestError(axiosError.response.status, message, axiosError.response.data?.fieldErrors);
    }

    // No response at all: network failure, backend down, or a CORS rejection
    // the browser never lets JS read the details of.
    throw new ApiRequestError(0, "Couldn't reach the server. Check that the backend is running and reachable.");
  }
}
