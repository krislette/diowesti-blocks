const API_BASE_URL = "http://127.0.0.1:8000/api";

export interface AuditArea {
  id: number;
  name: string;
  parent_audit_area_id: number | null;
  active: number;
  parent_audit_area?: {
    id: number;
    name: string;
  } | null;
  child_audit_areas?: {
    id: number;
    name: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface AuditAreaFormData {
  ara_name: string;
  ara_ara_id: number | null;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  error?: string;
}

class AuditAreaService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok || !data.success) {
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
    const response = await this.request<ApiResponse<AuditArea[]>>(
      "/audit-areas"
    );
    return response.data!;
  }

  async getAuditAreaById(id: number): Promise<AuditArea> {
    const response = await this.request<ApiResponse<AuditArea>>(
      `/audit-areas/${id}`
    );
    return response.data!;
  }

  async createAuditArea(data: AuditAreaFormData): Promise<AuditArea> {
    const response = await this.request<ApiResponse<AuditArea>>(
      "/audit-areas",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return response.data!;
  }

  async updateAuditArea(
    id: number,
    data: AuditAreaFormData
  ): Promise<AuditArea> {
    const response = await this.request<ApiResponse<AuditArea>>(
      `/audit-areas/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return response.data!;
  }

  async deleteAuditArea(id: number): Promise<void> {
    const response = await this.request<ApiResponse<null>>(
      `/audit-areas/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.success) {
      throw new Error(response.message || "Failed to delete audit area");
    }
  }

  async getParentOptions(): Promise<AuditArea[]> {
    const response = await this.request<ApiResponse<AuditArea[]>>(
      "/audit-areas-parent-options"
    );
    return response.data!;
  }
}

export const auditAreaService = new AuditAreaService();
