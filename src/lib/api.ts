const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000";

type JsonLike = Record<string, unknown>;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload: JsonLike = isJson ? await response.json() : {};

  if (!response.ok) {
    const message =
      typeof payload.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}
