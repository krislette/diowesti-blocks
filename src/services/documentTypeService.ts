export interface DocumentType {
  id: number;
  name: string;
  active: boolean;
}

export interface CreateDocumentTypeData {
  doc_typ_name: string;
  doc_typ_active: number;
}

export interface UpdateDocumentTypeData {
  doc_typ_name?: string;
  doc_typ_active?: number;
}

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

class DocumentTypeService {
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

  async getDocumentTypes(): Promise<DocumentType[]> {
    const response = await this.request<{
      success: boolean;
      data: DocumentType[];
    }>("/document-types");
    return response.data;
  }

  async getDocumentType(id: number): Promise<DocumentType> {
    const response = await this.request<{
      success: boolean;
      data: DocumentType;
    }>(`/document-types/${id}`);
    return response.data;
  }

  async createDocumentType(
    data: CreateDocumentTypeData
  ): Promise<DocumentType> {
    const response = await this.request<{
      success: boolean;
      data: DocumentType;
    }>("/document-types", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateDocumentType(
    id: number,
    data: UpdateDocumentTypeData
  ): Promise<DocumentType> {
    const response = await this.request<{
      success: boolean;
      data: DocumentType;
    }>(`/document-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteDocumentType(id: number): Promise<void> {
    await this.request<{ success: boolean; message: string }>(
      `/document-types/${id}`,
      {
        method: "DELETE",
      }
    );
  }
}

export const documentTypeService = new DocumentTypeService();
