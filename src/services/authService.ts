const API_BASE_URL = "http://127.0.0.1:8000/api/auth";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    const result: AuthResponse = await response.json();
    localStorage.setItem("auth_token", result.access_token);
    localStorage.setItem("user", JSON.stringify(result.user));
    return result;
  }

  async registerOnly(data: RegisterData): Promise<AuthResponse> {
    const payload = {
      usr_name: data.name,
      usr_email: data.email,
      usr_password: data.password,
      usr_password_confirmation: data.password_confirmation,
    };

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      const message =
        error.message ||
        (error.errors
          ? Object.values(error.errors).flat().join(" ")
          : "Registration failed");
      throw new Error(message);
    }

    const result: AuthResponse = await response.json();
    return result;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const payload = {
      usr_email: data.email,
      usr_password: data.password,
    };

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      const message =
        error.message ||
        (error.errors
          ? Object.values(error.errors).flat().join(" ")
          : "Login failed");
      throw new Error(message);
    }

    const result: AuthResponse = await response.json();
    localStorage.setItem("auth_token", result.access_token);
    localStorage.setItem("user", JSON.stringify(result.user));
    return result;
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Logout failed");
    }

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }

  async getUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid, clear storage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        throw new Error("Unauthorized");
      }
      throw new Error("Failed to fetch user");
    }

    return response.json();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const apiService = new ApiService();
