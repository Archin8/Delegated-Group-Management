export enum Permission {
  // Group Management
  MANAGE_GROUP = 'MANAGE_GROUP',
  VIEW_GROUP = 'VIEW_GROUP',
  DELETE_GROUP = 'DELETE_GROUP',

  // Member Management
  MANAGE_MEMBERS = 'MANAGE_MEMBERS',
  INVITE_MEMBERS = 'INVITE_MEMBERS',
  REMOVE_MEMBERS = 'REMOVE_MEMBERS',
  APPROVE_REQUESTS = 'APPROVE_REQUESTS',

  // Role Management
  MANAGE_ROLES = 'MANAGE_ROLES',
  ASSIGN_ROLES = 'ASSIGN_ROLES',

  // Content Management
  MANAGE_CONTENT = 'MANAGE_CONTENT',
  VIEW_CONTENT = 'VIEW_CONTENT',

  // Settings Management
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
}

export enum SystemRole {
  OWNER = 'OWNER',
  DELEGATED_ADMIN = 'DELEGATED_ADMIN',
  MEMBER = 'MEMBER',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  groupId: string;
  permissions: Permission[];
  priority: number;
  parentRoleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  id: string;
  user: User;
  role: Role;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JoinRequest {
  id: string;
  userId: string;
  groupId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
} 