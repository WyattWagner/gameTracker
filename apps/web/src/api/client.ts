import type { ApiError, MaterialRank, PatchMonsterStats, PatchWeakness } from "@game-tracker/shared";

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
    const isFormData = init?.body instanceof FormData;
    const headers: HeadersInit = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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
    updateMonster: (id: string, body: import("@game-tracker/shared").UpdateMonsterRequest) =>
      request<import("@game-tracker/shared").Monster>(`/monsters/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    patchMonsterStats: (id: string, body: PatchMonsterStats) =>
      request<import("@game-tracker/shared").Monster>(`/monsters/${id}/stats`, { method: "PATCH", body: JSON.stringify(body) }),
    huntedAction: (id: string) =>
      request<import("@game-tracker/shared").Monster>(`/monsters/${id}/actions/hunted`, { method: "POST" }),
    capturedAction: (id: string) =>
      request<import("@game-tracker/shared").Monster>(`/monsters/${id}/actions/captured`, { method: "POST" }),
    uploadMonsterImage: async (id: string, file: File) => {
      const token = getToken();
      const form = new FormData();
      form.append("image", file);
      const response = await fetch(`${API_BASE}/monsters/${id}/image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      return parseResponse<import("@game-tracker/shared").Monster>(response);
    },
    deleteMonsterImage: (id: string) =>
      request<import("@game-tracker/shared").Monster>(`/monsters/${id}/image`, { method: "DELETE" }),
    getMhDetail: (id: string) =>
      request<import("@game-tracker/shared").MonsterHunterDetail>(`/monsters/${id}/mh-detail`),
    patchWeakness: (monsterId: string, body: PatchWeakness) =>
      request<import("@game-tracker/shared").WeaknessEntry>(`/monsters/${monsterId}/weaknesses`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    createBodyPart: (monsterId: string, name: string) =>
      request<import("@game-tracker/shared").MonsterBodyPart>(`/monsters/${monsterId}/body-parts`, {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    deleteBodyPart: (monsterId: string, bodyPartId: string) =>
      request<void>(`/monsters/${monsterId}/body-parts/${bodyPartId}`, { method: "DELETE" }),
    updateAilment: (monsterId: string, ailmentId: string, body: Record<string, unknown>) =>
      request<import("@game-tracker/shared").MonsterAilment>(`/monsters/${monsterId}/ailments/${ailmentId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    createAilment: (monsterId: string, name: string) =>
      request<import("@game-tracker/shared").MonsterAilment>(`/monsters/${monsterId}/ailments`, {
        method: "POST",
        body: JSON.stringify({ name, isCustom: true }),
      }),
    deleteAilment: (monsterId: string, ailmentId: string) =>
      request<void>(`/monsters/${monsterId}/ailments/${ailmentId}`, { method: "DELETE" }),
    listMaterials: (monsterId: string, rank?: string) =>
      request<{ materials: import("@game-tracker/shared").MonsterMaterial[] }>(
        `/monsters/${monsterId}/materials${rank ? `?rank=${rank}` : ""}`,
      ),
    createMaterial: (monsterId: string, body: { rank: string; name: string }) =>
      request<import("@game-tracker/shared").MonsterMaterial>(`/monsters/${monsterId}/materials`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    updateMaterial: (monsterId: string, materialId: string, body: Record<string, unknown>) =>
      request<import("@game-tracker/shared").MonsterMaterial>(`/monsters/${monsterId}/materials/${materialId}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    initializeMaterialRank: (monsterId: string, from: MaterialRank, to: MaterialRank) =>
      request<{ materials: import("@game-tracker/shared").MonsterMaterial[] }>(
        `/monsters/${monsterId}/materials/initialize-rank`,
        { method: "POST", body: JSON.stringify({ from, to }) },
      ),
    addMaterialBodyPartDrop: (monsterId: string, materialId: string, bodyPartId: string, chance: number) =>
      request(`/monsters/${monsterId}/materials/${materialId}/body-part-drops`, {
        method: "POST",
        body: JSON.stringify({ bodyPartId, chance }),
      }),
    removeMaterialBodyPartDrop: (monsterId: string, materialId: string, bodyPartId: string) =>
      request<void>(`/monsters/${monsterId}/materials/${materialId}/body-part-drops/${bodyPartId}`, {
        method: "DELETE",
      }),
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
