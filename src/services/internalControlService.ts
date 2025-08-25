export interface InternalControlComponent {
  sequenceNumber: number;
  description: string;
}

export interface InternalControl {
  id: number;
  auditAreaId: number;
  auditAreaName: string;
  category: string;
  description: string;
  active: boolean;
  componentsCount: number;
  components: InternalControlComponent[];
}

export interface CreateInternalControlData {
  ic_ara_id: number;
  ic_category: string;
  ic_desc: string;
  ic_active: number;
  components: {
    com_seqnum: number;
    com_desc: string;
  }[];
}

export interface UpdateInternalControlData {
  ic_ara_id?: number;
  ic_category?: string;
  ic_desc?: string;
  ic_active?: number;
  components?: {
    com_seqnum: number;
    com_desc: string;
  }[];
}

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

class InternalControlService {
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

  async getInternalControls(): Promise<InternalControl[]> {
    const response = await this.request<{
      success: boolean;
      data: any[];
    }>("/internal-controls");

    return response.data.map((item) => ({
      id: item.id,
      auditAreaId: item.auditAreaId,
      auditAreaName: item.auditAreaName,
      category: item.category,
      description: item.description,
      active: item.active === 1,
      componentsCount: item.componentsCount,
      components: item.components || [],
    }));
  }

  async getInternalControl(id: number): Promise<InternalControl> {
    const response = await this.request<{
      success: boolean;
      data: any;
    }>(`/internal-controls/${id}`);

    const item = response.data;
    return {
      id: item.id,
      auditAreaId: item.auditAreaId,
      auditAreaName: item.auditAreaName,
      category: item.category,
      description: item.description,
      active: item.active === 1,
      componentsCount: item.componentsCount,
      components: item.components || [],
    };
  }

  async createInternalControl(
    data: CreateInternalControlData
  ): Promise<InternalControl> {
    const response = await this.request<{
      success: boolean;
      data: any;
    }>("/internal-controls", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const item = response.data;
    return {
      id: item.id,
      auditAreaId: item.auditAreaId,
      auditAreaName: item.auditAreaName,
      category: item.category,
      description: item.description,
      active: item.active === 1,
      componentsCount: item.componentsCount,
      components: item.components || [],
    };
  }

  async updateInternalControl(
    id: number,
    data: UpdateInternalControlData
  ): Promise<InternalControl> {
    const response = await this.request<{
      success: boolean;
      data: any;
    }>(`/internal-controls/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    const item = response.data;
    return {
      id: item.id,
      auditAreaId: item.auditAreaId,
      auditAreaName: item.auditAreaName,
      category: item.category,
      description: item.description,
      active: item.active === 1,
      componentsCount: item.componentsCount,
      components: item.components || [],
    };
  }

  async deleteInternalControl(id: number): Promise<void> {
    await this.request<{ success: boolean; message: string }>(
      `/internal-controls/${id}`,
      {
        method: "DELETE",
      }
    );
  }
}

export const internalControlService = new InternalControlService();
