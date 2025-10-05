// API utility functions for communicating with Lovable backend

const API_BASE_URL = import.meta.env.VITE_LOVABLE_BACKEND_URL || 'http://localhost:3000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Game-related API calls
  async createGame(settings: any): Promise<ApiResponse> {
    return this.request('/api/games', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async getGame(gameId: string): Promise<ApiResponse> {
    return this.request(`/api/games/${gameId}`);
  }

  async updateGame(gameId: string, updates: any): Promise<ApiResponse> {
    return this.request(`/api/games/${gameId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // User-related API calls
  async createUser(userData: any): Promise<ApiResponse> {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(userId: string): Promise<ApiResponse> {
    return this.request(`/api/users/${userId}`);
  }

  // Statistics API calls
  async getGameStats(userId: string): Promise<ApiResponse> {
    return this.request(`/api/users/${userId}/stats`);
  }

  async saveGameResult(gameId: string, result: any): Promise<ApiResponse> {
    return this.request(`/api/games/${gameId}/result`, {
      method: 'POST',
      body: JSON.stringify(result),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/api/health');
  }
}

// Create a default API client instance
export const apiClient = new ApiClient();

// Utility functions for common operations
export const checkBackendConnection = async (): Promise<boolean> => {
  const response = await apiClient.healthCheck();
  return response.success;
};

export const saveGameToBackend = async (gameData: any): Promise<boolean> => {
  const response = await apiClient.createGame(gameData);
  return response.success;
};

export const getBackendUrl = (): string => {
  return API_BASE_URL;
};

export const isProduction = (): boolean => {
  return import.meta.env.VITE_NODE_ENV === 'production';
};