// API configuration and utilities
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:5000';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('harmonix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new APIError(data.error || 'Request failed', response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      // Network or other errors
      throw new APIError('Network error. Please check your connection.', 0, null);
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }

  get isValidationError() {
    return this.data?.error?.code === 'VALIDATION_ERROR';
  }

  get isAuthError() {
    return this.status === 401 || this.data?.error?.code === 'AUTHENTICATION_ERROR';
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get validationErrors() {
    return this.data?.error?.details || {};
  }
}

// Create singleton instance
const apiClient = new APIClient();

// Auth API methods
export const authAPI = {
  async register(userData) {
    return apiClient.post('/api/auth/register', userData);
  },

  async login(credentials) {
    return apiClient.post('/api/auth/login', credentials);
  },

  async logout() {
    return apiClient.post('/api/auth/logout');
  },

  async getCurrentUser() {
    return apiClient.get('/api/auth/me');
  },

  async refreshToken() {
    return apiClient.post('/api/auth/refresh');
  }
};

// User API methods
export const userAPI = {
  async updateProfile(userData) {
    return apiClient.put('/api/user/profile', userData);
  },

  async getProfile() {
    return apiClient.get('/api/user/profile');
  },

  async deleteAccount() {
    return apiClient.delete('/api/user/account');
  }
};

// Demo API methods
export const demoAPI = {
  async startDemo(sessionData) {
    return apiClient.post('/api/demo/start', sessionData);
  },

  async sendMessage(sessionId, message) {
    return apiClient.post(`/api/demo/${sessionId}/message`, { message });
  },

  async getSession(sessionId) {
    return apiClient.get(`/api/demo/${sessionId}`);
  }
};

// Subscription API methods
export const subscriptionAPI = {
  async getSubscription() {
    return apiClient.get('/api/subscription');
  },

  async updateSubscription(planId) {
    return apiClient.put('/api/subscription', { planId });
  },

  async cancelSubscription() {
    return apiClient.delete('/api/subscription');
  },

  async createPaymentIntent(amount) {
    return apiClient.post('/api/subscription/payment-intent', { amount });
  }
};

// Health check
export const healthAPI = {
  async check() {
    return apiClient.get('/api/health');
  }
};

// Token management utilities
export const tokenManager = {
  getToken() {
    return localStorage.getItem('harmonix_token');
  },

  setToken(token) {
    localStorage.setItem('harmonix_token', token);
  },

  removeToken() {
    localStorage.removeItem('harmonix_token');
  },

  isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
};

export { APIError, apiClient };
export default apiClient;