import { Group, GroupMember, Permission } from '../types';
import api from './axios';

const API_URL = `/groups`;

export const groupService = {
  // Group operations
  createGroup: async (data: { name: string; description: string }) => {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  getGroups: async () => {
    const response = await api.get(`${API_URL}/user/groups`);
    return response.data;
  },

  getGroup: async (groupId: string) => {
    const response = await api.get(`${API_URL}/${groupId}`);
    return response.data;
  },

  updateGroup: async (groupId: string, data: Partial<Group>) => {
    const response = await api.put(`${API_URL}/${groupId}`, data);
    return response.data;
  },

  deleteGroup: async (groupId: string) => {
    await api.delete(`${API_URL}/${groupId}`);
  },

  // Role operations
  getRoles: async (groupId: string) => {
    const response = await api.get(`${API_URL}/${groupId}/roles`);
    return response.data;
  },

  createRole: async (groupId: string, roleData: {
    name: string;
    permissions: Permission[];
    priority: number;
  }) => {
    const response = await api.post(`${API_URL}/${groupId}/roles`, roleData);
    return response.data;
  },

  updateRole: async (groupId: string, roleId: string, roleData: {
    name: string;
    permissions: Permission[];
    priority: number;
  }) => {
    const response = await api.put(`${API_URL}/${groupId}/roles/${roleId}`, roleData);
    return response.data;
  },

  deleteRole: async (groupId: string, roleId: string) => {
    await api.delete(`${API_URL}/${groupId}/roles/${roleId}`);
  },

  // Member operations
  getMembers: async (groupId: string) => {
    const response = await api.get(`${API_URL}/${groupId}/members`);
    return response.data;
  },

  async addMember(groupId: string, data: { email: string; roleId: string }): Promise<GroupMember> {
    const response = await api.post(`/groups/${groupId}/members`, data);
    return response.data;
  },

  updateMemberRole: async (groupId: string, memberId: string, roleId: string) => {
    const response = await api.put(`${API_URL}/${groupId}/members/${memberId}`, { roleId });
    return response.data;
  },

  removeMember: async (groupId: string, memberId: string) => {
    await api.delete(`${API_URL}/${groupId}/members/${memberId}`);
  },

  // Join request operations
  getJoinRequests: async (groupId: string) => {
    const response = await api.get(`${API_URL}/${groupId}/join-requests`);
    return response.data;
  },

  createJoinRequest: async (groupId: string) => {
    const response = await api.post(`${API_URL}/${groupId}/join-requests`);
    return response.data;
  },

  approveJoinRequest: async (groupId: string, requestId: string) => {
    const response = await api.put(`${API_URL}/${groupId}/join-requests/${requestId}/approve`);
    return response.data;
  },

  rejectJoinRequest: async (groupId: string, requestId: string) => {
    const response = await api.put(`${API_URL}/${groupId}/join-requests/${requestId}/reject`);
    return response.data;
  },

  // Role Management
  async assignRole(groupId: string, userId: string, roleId: string): Promise<void> {
    await api.post(`${API_URL}/${groupId}/members/${userId}/roles`, { roleId });
  },

  async removeRole(groupId: string, userId: string, roleId: string): Promise<void> {
    await api.delete(`${API_URL}/${groupId}/members/${userId}/roles/${roleId}`);
  },
}; 