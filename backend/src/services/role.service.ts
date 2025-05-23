import { AppDataSource } from '../config/database';
import { Role } from '../entities/Role';
import { Permission } from '../types';
import { Group } from '../entities/Group';

export class RoleService {
  private roleRepository = AppDataSource.getRepository(Role);
  private groupRepository = AppDataSource.getRepository(Group);

  async createRole(data: {
    name: string;
    groupId: string;
    permissions: Permission[];
    priority: number;
  }): Promise<Role> {
    const group = await this.groupRepository.findOne({
      where: { id: data.groupId },
    });

    if (!group) {
      throw new Error('Group not found');
    }

    const role = this.roleRepository.create(data);
    return this.roleRepository.save(role);
  }

  async getRoleById(id: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['group'],
    });
  }

  async updateRole(roleId: string, data: {
    name: string;
    groupId: string;
    permissions: Permission[];
    priority: number;
  }): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    if (role.groupId !== data.groupId) {
      throw new Error('Cannot change role group');
    }

    Object.assign(role, data);
    return this.roleRepository.save(role);
  }

  async deleteRole(roleId: string): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    await this.roleRepository.remove(role);
  }

  async getGroupRoles(groupId: string): Promise<Role[]> {
    return this.roleRepository.find({
      where: { groupId },
      order: { priority: 'DESC' },
    });
  }

  async updateRolePermissions(id: string, permissions: Permission[]): Promise<Role> {
    const role = await this.getRoleById(id);
    if (!role) {
      throw new Error('Role not found');
    }

    role.permissions = permissions;
    return this.roleRepository.save(role);
  }

  async updateRolePriority(id: string, priority: number): Promise<Role> {
    const role = await this.getRoleById(id);
    if (!role) {
      throw new Error('Role not found');
    }

    role.priority = priority;
    return this.roleRepository.save(role);
  }

  async checkPermission(roleId: string, permission: Permission): Promise<boolean> {
    const role = await this.getRoleById(roleId);
    if (!role) {
      return false;
    }

    return role.permissions.includes(permission);
  }
} 