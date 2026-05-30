import type { ApiError } from "@game-tracker/shared";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api/v1";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiError | null;
    throw new ApiClientError(error?.message ?? response.statusText, response.status, error?.code);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function createApiClient(getToken: () => string | null) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
    return parseResponse<T>(response);
  }

  return {
    register: (body: { email: string; password: string }) =>
      request<{ accessToken: string }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request<{ accessToken: string }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => request<{ id: string; email: string }>("/auth/me"),
    listMonsters: (query = "") => request<{ monsters: import("@game-tracker/shared").Monster[]; total: number }>(`/monsters${query}`),
    getMonster: (id: string) => request<import("@game-tracker/shared").Monster>(`/monsters/${id}`),
    createMonster: (body: import("@game-tracker/shared").CreateMonsterRequest) =>
      request<import("@game-tracker/shared").Monster>("/monsters", { method: "POST", body: JSON.stringify(body) }),
    dashboardStats: (query = "") => request<import("@game-tracker/shared").DashboardStats>(`/stats/dashboard${query}`),
    listDrops: (query = "") => request<{ drops: import("@game-tracker/shared").Drop[] }>(`/drops${query}`),
    createDrop: (body: import("@game-tracker/shared").CreateDropRequest) =>
      request<import("@game-tracker/shared").Drop>("/drops", { method: "POST", body: JSON.stringify(body) }),
    createQuest: (body: import("@game-tracker/shared").CreateQuestRequest) =>
      request<import("@game-tracker/shared").Quest>("/quests", { method: "POST", body: JSON.stringify(body) }),
    recordEncounter: (body: import("@game-tracker/shared").CreateEncounterRequest) =>
      request<import("@game-tracker/shared").Encounter>("/quests/encounters", { method: "POST", body: JSON.stringify(body) }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
