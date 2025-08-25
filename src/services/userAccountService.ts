export interface UserAccount {
  id: number;
  name: string;
  auditorId: number;
  level: number;
  email: string;
  active: boolean;
  loggedIn: number;
  agencyName?: string;
  agencyAcronym?: string;
  agency?: string;
  position?: string;
}

export interface CreateUserAccountData {
  usr_name: string;
  usr_aur_id: number;
  usr_level: number;
  usr_email: string;
  usr_password: string;
  usr_active: number;
}

export interface UpdateUserAccountData {
  usr_name?: string;
  usr_aur_id?: number;
  usr_level?: number;
  usr_email?: string;
  usr_password?: string;
  usr_active?: number;
}

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

class UserAccountService {
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

  async getUserAccounts(): Promise<UserAccount[]> {
    const response = await this.request<{ success: boolean; data: any[] }>(
      "/user-accounts"
    );
    // Transform the data to match UI
    return response.data.map((user) => ({
      ...user,
      loggedIn: user.logged,
      agency: user.agencyName || "N/A",
    }));
  }

  async getUserAccount(id: number): Promise<UserAccount> {
    const response = await this.request<{
      success: boolean;
      data: UserAccount;
    }>(`/user-accounts/${id}`);
    return response.data;
  }

  async createUserAccount(data: CreateUserAccountData): Promise<UserAccount> {
    const response = await this.request<{
      success: boolean;
      data: UserAccount;
    }>("/user-accounts", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateUserAccount(
    id: number,
    data: UpdateUserAccountData
  ): Promise<UserAccount> {
    const response = await this.request<{
      success: boolean;
      data: UserAccount;
    }>(`/user-accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteUserAccount(id: number): Promise<void> {
    await this.request<{ success: boolean; message: string }>(
      `/user-accounts/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  getLevelName(level: number): string {
    const levels: { [key: number]: string } = {
      1: "System Administrator",
      2: "Director",
      3: "Division Chief",
      4: "Supervisor",
      5: "Internal Auditor",
      6: "External Auditor",
      7: "Auditee",
      8: "Authorized Viewer",
    };
    return levels[level] || "Unknown Level";
  }
}

export const userAccountService = new UserAccountService();
