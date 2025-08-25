export interface AuditCriteria {
  id: number;
  name: string;
  areas: string;
  references: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAuditCriteriaData {
  cra_name: string;
  cra_areas: string;
  cra_references: string;
  cra_active: number; // 1 or 0
}

export interface UpdateAuditCriteriaData {
  cra_name?: string;
  cra_areas?: string;
  cra_references?: string;
  cra_active?: number; // 1 or 0
}

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

class AuditCriteriaService {
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

  async getAuditCriteria(): Promise<AuditCriteria[]> {
    const response = await this.request<{ success: boolean; data: any[] }>(
      "/audit-criteria"
    );

    return response.data.map((item) => ({
      id: item.id,
      name: item.name,
      areas: item.areas,
      references: item.references,
      active: item.active === 1,
      createdAt: item.createdAt ?? undefined,
      updatedAt: item.updatedAt ?? undefined,
    }));
  }

  async getAuditCriterion(id: number): Promise<AuditCriteria> {
    const response = await this.request<{ success: boolean; data: any }>(
      `/audit-criteria/${id}`
    );

    const item = response.data;
    return {
      id: item.id,
      name: item.name,
      areas: item.areas,
      references: item.references,
      active: item.active === 1,
      createdAt: item.createdAt ?? undefined,
      updatedAt: item.updatedAt ?? undefined,
    };
  }

  async createAuditCriterion(
    data: CreateAuditCriteriaData
  ): Promise<AuditCriteria> {
    const response = await this.request<{ success: boolean; data: any }>(
      "/audit-criteria",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    const item = response.data;
    return {
      id: item.id,
      name: item.name,
      areas: item.areas,
      references: item.references,
      active: item.active === 1,
      createdAt: item.createdAt ?? undefined,
      updatedAt: item.updatedAt ?? undefined,
    };
  }

  async updateAuditCriterion(
    id: number,
    data: UpdateAuditCriteriaData
  ): Promise<AuditCriteria> {
    const response = await this.request<{ success: boolean; data: any }>(
      `/audit-criteria/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    const item = response.data;
    return {
      id: item.id,
      name: item.name,
      areas: item.areas,
      references: item.references,
      active: item.active === 1,
      createdAt: item.createdAt ?? undefined,
      updatedAt: item.updatedAt ?? undefined,
    };
  }

  async deleteAuditCriterion(id: number): Promise<void> {
    await this.request<{ success: boolean; message: string }>(
      `/audit-criteria/${id}`,
      { method: "DELETE" }
    );
  }
}

export const auditCriteriaService = new AuditCriteriaService();
