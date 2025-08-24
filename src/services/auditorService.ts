export interface Auditor {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  namePrefix: string | null;
  nameSuffix: string | null;
  external: number;
  position: string | null;
  salaryGrade: number;
  agencyId: number | null;
  agencyName: string;
  expertise: string | null;
  email: string;
  birthdate: string | null;
  contactNo: string | null;
  tin: string | null;
  status: number;
  photo: string | null;
  active: number;
}

export interface CreateAuditorData {
  aur_name_first: string;
  aur_name_last: string;
  aur_name_middle?: string;
  aur_name_prefix?: string;
  aur_name_suffix?: string;
  aur_external?: number;
  aur_position?: string;
  aur_salary_grade?: number;
  aur_agn_id?: number;
  aur_expertise?: string;
  aur_email: string;
  aur_birthdate?: string;
  aur_contact_no?: string;
  aur_tin?: string;
  aur_status?: number;
  aur_photo?: string;
  aur_active?: number;
}

export interface UpdateAuditorData {
  aur_name_first?: string;
  aur_name_last?: string;
  aur_name_middle?: string;
  aur_name_prefix?: string;
  aur_name_suffix?: string;
  aur_external?: number;
  aur_position?: string;
  aur_salary_grade?: number;
  aur_agn_id?: number;
  aur_expertise?: string;
  aur_email?: string;
  aur_birthdate?: string;
  aur_contact_no?: string;
  aur_tin?: string;
  aur_status?: number;
  aur_photo?: string;
  aur_active?: number;
}

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

class AuditorService {
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

  async getAuditors(): Promise<Auditor[]> {
    const response = await this.request<{ success: boolean; data: Auditor[] }>(
      "/auditors"
    );
    return response.data;
  }

  async getAuditor(id: number): Promise<Auditor> {
    const response = await this.request<{ success: boolean; data: Auditor }>(
      `/auditors/${id}`
    );
    return response.data;
  }

  async createAuditor(data: CreateAuditorData): Promise<Auditor> {
    const response = await this.request<{ success: boolean; data: Auditor }>(
      "/auditors",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return response.data;
  }

  async updateAuditor(id: number, data: UpdateAuditorData): Promise<Auditor> {
    const response = await this.request<{ success: boolean; data: Auditor }>(
      `/auditors/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return response.data;
  }

  async deleteAuditor(id: number): Promise<void> {
    await this.request<{ success: boolean; message: string }>(
      `/auditors/${id}`,
      {
        method: "DELETE",
      }
    );
  }
}

export const auditorService = new AuditorService();
