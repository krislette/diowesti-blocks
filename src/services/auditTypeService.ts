export interface AuditType {
  id: number;
  name: string;
  active: boolean;
}

export interface CreateAuditTypeData {
  aud_typ_name: string;
  aud_typ_active: number;
}

export interface UpdateAuditTypeData {
  aud_typ_name?: string;
  aud_typ_active?: number;
}

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

class AuditTypeService {
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

  async getAuditTypes(): Promise<AuditType[]> {
    const response = await this.request<{
      success: boolean;
      data: AuditType[];
    }>("/audit-types");
    return response.data;
  }

  async getAuditType(id: number): Promise<AuditType> {
    const response = await this.request<{ success: boolean; data: AuditType }>(
      `/audit-types/${id}`
    );
    return response.data;
  }

  async createAuditType(data: CreateAuditTypeData): Promise<AuditType> {
    const response = await this.request<{ success: boolean; data: AuditType }>(
      "/audit-types",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return response.data;
  }

  async updateAuditType(
    id: number,
    data: UpdateAuditTypeData
  ): Promise<AuditType> {
    const response = await this.request<{ success: boolean; data: AuditType }>(
      `/audit-types/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return response.data;
  }

  async deleteAuditType(id: number): Promise<void> {
    await this.request<{ success: boolean; message: string }>(
      `/audit-types/${id}`,
      {
        method: "DELETE",
      }
    );
  }
}

export const auditTypeService = new AuditTypeService();
