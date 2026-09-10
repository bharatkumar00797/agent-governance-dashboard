const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Agent {
  id: number;
  name: string;
  description?: string | null;
  owner: string;
  agent_type: string;
  status: string;
  risk_score: number;
  permissions: string[];
  data_access: string[];
  framework?: string | null;
  environment: string;
  is_shadow: boolean;
  metadata?: Record<string, any>;
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface AgentListResponse {
  total: number;
  agents: Agent[];
}

export interface AgentCreate {
  name: string;
  description?: string;
  owner: string;
  agent_type?: string;
  status?: string;
  permissions?: string[];
  data_access?: string[];
  framework?: string;
  environment?: string;
  is_shadow?: boolean;
  metadata?: Record<string, any>;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  listAgents: (params?: Record<string, string | number | boolean>) => {
    const q = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") q.set(k, String(v));
      });
    }
    const qs = q.toString();
    return request<AgentListResponse>(`/api/v1/agents${qs ? `?${qs}` : ""}`);
  },

  getAgent: (id: number) => request<Agent>(`/api/v1/agents/${id}`),

  createAgent: (data: AgentCreate) =>
    request<Agent>(`/api/v1/agents`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateAgent: (id: number, data: Partial<AgentCreate>) =>
    request<Agent>(`/api/v1/agents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteAgent: (id: number) =>
    request<void>(`/api/v1/agents/${id}`, { method: "DELETE" }),

  quarantine: (id: number) =>
    request<Agent>(`/api/v1/agents/${id}/quarantine`, { method: "POST" }),

  activate: (id: number) =>
    request<Agent>(`/api/v1/agents/${id}/activate`, { method: "POST" }),
};
