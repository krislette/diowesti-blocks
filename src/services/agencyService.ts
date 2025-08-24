export interface Agency {
  id: number;
  name: string;
  acronym: string;
  contactDetails: string;
  headOfAgency: string;
  position: string;
  classificationGroup: string;
  address: string;
  groupCode: string;
}

export interface CreateAgencyData {
  agn_id: number;
  agn_name: string;
  agn_acronym: string;
  agn_grp_code: string;
  agn_address: string;
  agn_head_name: string;
  agn_head_position: string;
  agn_contact_details: string;
}

export interface UpdateAgencyData {
  agn_name?: string;
  agn_acronym?: string;
  agn_grp_code?: string;
  agn_address?: string;
  agn_head_name?: string;
  agn_head_position?: string;
  agn_contact_details?: string;
}

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

class AgencyService {
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

  async getAgencies(): Promise<Agency[]> {
    const response = await this.request<{ success: boolean; data: Agency[] }>(
      "/agencies"
    );
    return response.data;
  }

  async getAgency(id: number): Promise<Agency> {
    const response = await this.request<{ success: boolean; data: Agency }>(
      `/agencies/${id}`
    );
    return response.data;
  }

  async createAgency(data: CreateAgencyData): Promise<Agency> {
    const response = await this.request<{ success: boolean; data: Agency }>(
      "/agencies",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return response.data;
  }

  async updateAgency(id: number, data: UpdateAgencyData): Promise<Agency> {
    const response = await this.request<{ success: boolean; data: Agency }>(
      `/agencies/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return response.data;
  }

  async deleteAgency(id: number): Promise<void> {
    await this.request<{ success: boolean; message: string }>(
      `/agencies/${id}`,
      {
        method: "DELETE",
      }
    );
  }
}

export const agencyService = new AgencyService();
