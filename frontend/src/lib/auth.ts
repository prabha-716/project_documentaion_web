import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
  provider: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

// Safe wrapper — returns null on server (SSR), real storage on client
const isBrowser = () => typeof window !== 'undefined';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    if (isBrowser()) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    if (isBrowser()) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },

  logout() {
    if (isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  getStoredUser(): User | null {
    if (!isBrowser()) return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    if (!isBrowser()) return false;
    return !!localStorage.getItem('token');
  },
};