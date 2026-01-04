// API Configuration
// In production, use same-origin (empty string) to go through Vercel proxy
// In development, use the local API server
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

// Token storage key
const TOKEN_KEY = 'kolka_auth_token';

// Toast singleton for showing errors (will be initialized when ToastContainer mounts)
import { toast } from '../context/ToastContext';

/**
 * API Client for making requests to the backend
 */
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem(TOKEN_KEY);
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          const errorMessage = `HTTP error! status: ${response.status}`;
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
        return null;
      }

      const data = await response.json();

      if (!response.ok) {
        // Clear token on 401 errors
        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
        }
        const errorMessage = data.error || data.message || `HTTP error! status: ${response.status}`;
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      // Show toast for network errors (not already shown)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
      }
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiClient(API_BASE_URL);

// ============================================
// Auth API
// ============================================

export const authApi = {
  /**
   * Register a new user
   */
  async signUp(email, password, name) {
    const result = await api.post('/api/auth/register', {
      email,
      password,
      name,
    });
    if (result?.token) {
      localStorage.setItem(TOKEN_KEY, result.token);
    }
    return result;
  },

  /**
   * Login with email and password
   */
  async signIn(email, password) {
    const result = await api.post('/api/auth/login', {
      email,
      password,
    });
    if (result?.token) {
      localStorage.setItem(TOKEN_KEY, result.token);
    }
    return result;
  },

  /**
   * Logout current user
   */
  async signOut() {
    localStorage.removeItem(TOKEN_KEY);
    return { success: true };
  },

  /**
   * Get current session (user from token)
   */
  async getSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }
    try {
      const result = await api.get('/api/auth/me');
      return result;
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },
};

// ============================================
// User API
// ============================================

export const userApi = {
  /**
   * Get current user profile with game progress
   */
  async getProfile() {
    return api.get('/api/users/me');
  },

  /**
   * Update user profile
   */
  async updateProfile(data) {
    return api.patch('/api/users/me', data);
  },

  /**
   * Initialize game progress for new user
   */
  async initProgress() {
    return api.post('/api/users/me/init-progress', {});
  },

  /**
   * Get public stats for a user
   */
  async getPublicStats(userId) {
    return api.get(`/api/users/${userId}/stats`);
  },
};

// ============================================
// Levels API
// ============================================

export const levelsApi = {
  /**
   * Get all levels with completion status
   */
  async getAll() {
    return api.get('/api/levels');
  },

  /**
   * Get single level with questions
   */
  async getBySlug(slug) {
    return api.get(`/api/levels/${slug}`);
  },

  /**
   * Get questions for a level
   */
  async getQuestions(slug) {
    return api.get(`/api/levels/${slug}/questions`);
  },
};

// ============================================
// Questions API
// ============================================

export const questionsApi = {
  /**
   * Get questions by level slug
   */
  async getByLevel(slug) {
    return api.get(`/api/questions/level/${slug}`);
  },

  /**
   * Validate an answer
   */
  async validateAnswer(questionId, answer) {
    return api.post(`/api/questions/${questionId}/answer`, { answer });
  },
};

// ============================================
// Progress API
// ============================================

export const progressApi = {
  /**
   * Get current user's game progress
   */
  async get() {
    return api.get('/api/progress');
  },

  /**
   * Submit level completion
   */
  async completeLevel(levelId, data) {
    return api.post(`/api/progress/levels/${levelId}/complete`, data);
  },

  /**
   * Get completion history
   */
  async getHistory() {
    return api.get('/api/progress/history');
  },
};

// ============================================
// Leaderboard API
// ============================================

export const leaderboardApi = {
  /**
   * Get global leaderboard
   */
  async getGlobal(limit = 10) {
    return api.get(`/api/leaderboard?limit=${limit}`);
  },

  /**
   * Get weekly leaderboard
   */
  async getWeekly(limit = 10) {
    return api.get(`/api/leaderboard/weekly?limit=${limit}`);
  },

  /**
   * Get current user's rank
   */
  async getMyRank() {
    return api.get('/api/leaderboard/me');
  },
};

// Export base API client for custom requests
export { api, API_BASE_URL, TOKEN_KEY };
