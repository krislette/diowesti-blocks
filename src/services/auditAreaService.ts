// auditAreaService.tsx
export interface AuditArea {
  id: number;
  name: string;
  parentId: number | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  children?: AuditArea[]; // For tree structure
  subAreas?: AuditArea[]; // For TreeNode compatibility
  isExpanded?: boolean;
  entriesCount?: number;
}

export interface CreateAuditAreaData {
  name: string;
  parentId: number | null;
  active: number; // 1 or 0
}

export interface UpdateAuditAreaData {
  name?: string;
  parentId?: number | null;
  active?: number; // 1 or 0
}

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

class AuditAreaService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async getAuditAreas(): Promise<AuditArea[]> {
    const response = await this.request<{ success: boolean; data: any[] }>(
      "/audit-areas"
    );

    return response.data.map((item) => ({
      id: item.id,
      name: item.name,
      parentId: item.parentId,
      active: item.active === 1,
      createdAt: item.createdAt ?? undefined,
      updatedAt: item.updatedAt ?? undefined,
      children: [],
      subAreas: [],
      isExpanded: false,
    }));
  }

  async getAuditArea(id: number): Promise<AuditArea> {
    const response = await this.request<{ success: boolean; data: any }>(
      `/audit-areas/${id}`
    );

    const item = response.data;
    return {
      id: item.id,
      name: item.name,
      parentId: item.parentId,
      active: item.active === 1,
      createdAt: item.createdAt ?? undefined,
      updatedAt: item.updatedAt ?? undefined,
      children: [],
      subAreas: [],
      isExpanded: false,
    };
  }

  async createAuditArea(data: CreateAuditAreaData): Promise<AuditArea> {
    const payload = {
      ara_name: data.name,
      ara_ara_id: data.parentId,
      ara_active: data.active,
    };

    const response = await this.request<{ success: boolean; data: any }>(
      "/audit-areas",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    const item = response.data;
    return {
      id: item.id,
      name: item.name,
      parentId: item.parentId,
      active: item.active === 1,
      createdAt: item.createdAt ?? undefined,
      updatedAt: item.updatedAt ?? undefined,
      children: [],
      subAreas: [],
      isExpanded: false,
    };
  }

  async updateAuditArea(
    id: number,
    data: UpdateAuditAreaData
  ): Promise<AuditArea> {
    const payload: any = {};
    if (data.name !== undefined) payload.ara_name = data.name;
    if (data.parentId !== undefined) payload.ara_ara_id = data.parentId;
    if (data.active !== undefined) payload.ara_active = data.active;

    const response = await this.request<{ success: boolean; data: any }>(
      `/audit-areas/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    const item = response.data;
    return {
      id: item.id,
      name: item.name,
      parentId: item.parentId,
      active: item.active === 1,
      createdAt: item.createdAt ?? undefined,
      updatedAt: item.updatedAt ?? undefined,
      children: [],
      subAreas: [],
      isExpanded: false,
    };
  }

  async deleteAuditArea(id: number): Promise<void> {
    await this.request<{ success: boolean; message: string }>(
      `/audit-areas/${id}`,
      { method: "DELETE" }
    );
  }
}

export const auditAreaService = new AuditAreaService();
