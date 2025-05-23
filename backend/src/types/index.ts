export enum Permission {
  // Group management permissions
  VIEW_GROUP_INFO = 'VIEW_GROUP_INFO',
  MANAGE_GROUP = 'MANAGE_GROUP',
  DELETE_GROUP = 'DELETE_GROUP',

  // Member management permissions
  VIEW_MEMBERS = 'VIEW_MEMBERS',
  MANAGE_MEMBERS = 'MANAGE_MEMBERS',
  INVITE_MEMBERS = 'INVITE_MEMBERS',
  REMOVE_MEMBERS = 'REMOVE_MEMBERS',
  APPROVE_REQUESTS = 'APPROVE_REQUESTS',

  // Role management permissions
  VIEW_ROLES = 'VIEW_ROLES',
  MANAGE_ROLES = 'MANAGE_ROLES',
  ASSIGN_ROLES = 'ASSIGN_ROLES',

  // Content management permissions
  VIEW_CONTENT = 'VIEW_CONTENT',
  CREATE_CONTENT = 'CREATE_CONTENT',
  EDIT_CONTENT = 'EDIT_CONTENT',
  DELETE_CONTENT = 'DELETE_CONTENT',

  // Settings management permissions
  VIEW_SETTINGS = 'VIEW_SETTINGS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS'
}

export enum SystemRole {
  OWNER = 'OWNER',
  DELEGATED_ADMIN = 'DELEGATED_ADMIN',
  MEMBER = 'MEMBER'
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  groupId: string;
  permissions: Permission[];
  priority: number;
  parentRoleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  roleId: string;
  joinedAt: Date;
  updatedAt: Date;
}

export interface JoinRequest {
  id: string;
  userId: string;
  groupId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'MEMBERSHIP_CHANGE' | 'ROLE_CHANGE' | 'JOIN_REQUEST';
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
} 