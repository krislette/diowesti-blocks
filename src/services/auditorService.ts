export interface Auditor {
  id: number;
  name: string;
  agency: string;
  position: string;
  contactDetails: string;
  birthdate: string;
  expertise: string;
  engagements: number;
  rating: number;
  salaryGrade?: number;
  email?: string;
  tin?: string;
  status?: string;
  isInternal?: boolean;
}

export interface CreateAuditorData {
  aur_id: number;
  aur_name: string;
  aur_agency: string;
  aur_position: string;
  aur_contact_details: string;
  aur_birthdate: string;
  aur_expertise: string;
  aur_engagements?: number;
  aur_rating?: number;
  aur_salary_grade?: number;
  aur_email?: string;
  aur_tin?: string;
  aur_status?: string;
  aur_is_internal?: boolean;
}

export interface UpdateAuditorData {
  aur_name?: string;
  aur_agency?: string;
  aur_position?: string;
  aur_contact_details?: string;
  aur_birthdate?: string;
  aur_expertise?: string;
  aur_engagements?: number;
  aur_rating?: number;
  aur_salary_grade?: number;
  aur_email?: string;
  aur_tin?: string;
  aur_status?: string;
  aur_is_internal?: boolean;
}

const API_BASE_URL = "http://127.0.0.1:8000/api";

class AuditorService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}/v1${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // TODO: Add authorization header if auth is implemented in the future
        // "Authorization": `Bearer ${getToken()}`,
      },
      ...options,
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
