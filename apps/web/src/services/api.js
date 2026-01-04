// API Configuration
// In production, use same-origin (empty string) to go through Vercel proxy
// In development, use the local API server
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

/**
 * API Client for making requests to the backend
 */
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config = {
      ...options,
      credentials: 'include', // Include cookies for session
      headers: {
        'Content-Type': 'application/json',
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return null;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
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
    return api.post('/api/auth/sign-up/email', {
      email,
      password,
      name,
    });
  },

  /**
   * Login with email and password
   */
  async signIn(email, password) {
    return api.post('/api/auth/sign-in/email', {
      email,
      password,
    });
  },

  /**
   * Logout current user
   */
  async signOut() {
    return api.post('/api/auth/sign-out', {});
  },

  /**
   * Get current session
   */
  async getSession() {
    return api.get('/api/auth/get-session');
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
export { api, API_BASE_URL };
