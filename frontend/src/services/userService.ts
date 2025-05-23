import api from './axios';
import { User } from '../types';

export const userService = {
  // Get all users (admin only)
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.put('/users/change-password', data);
    return response.data;
  },

  // Delete user account
  deleteAccount: async () => {
    await api.delete('/users/profile');
  },

  // Admin operations
  createUser: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    await api.delete(`/users/${userId}`);
  },
}; 