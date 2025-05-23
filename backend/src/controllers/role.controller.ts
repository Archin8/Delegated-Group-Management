import { Response } from 'express';
import { RoleService } from '../services/role.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Permission } from '../types';

export class RoleController {
  private roleService = new RoleService();

  async createRole(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { groupId } = req.params;
      const { name, permissions, priority } = req.body;
      const role = await this.roleService.createRole({
        name,
        groupId,
        permissions,
        priority,
      });

      res.status(201).json(role);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create role' });
    }
  }

  async getRole(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const role = await this.roleService.getRoleById(id);
      
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }

      res.json(role);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get role' });
    }
  }

  async updateRole(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { groupId, roleId } = req.params;
      const { name, permissions, priority } = req.body;
      const role = await this.roleService.updateRole(roleId, {
        name,
        groupId,
        permissions,
        priority,
      });

      res.json(role);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update role' });
    }
  }

  async deleteRole(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { roleId } = req.params;
      await this.roleService.deleteRole(roleId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to delete role' });
    }
  }

  async getGroupRoles(req: AuthenticatedRequest, res: Response) {
    try {
      const { groupId } = req.params;
      const roles = await this.roleService.getGroupRoles(groupId);
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get group roles' });
    }
  }

  async updateRolePermissions(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { id } = req.params;
      const { permissions } = req.body;
      const role = await this.roleService.updateRolePermissions(id, permissions);
      res.json(role);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update role permissions' });
    }
  }

  async updateRolePriority(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { id } = req.params;
      const { priority } = req.body;
      const role = await this.roleService.updateRolePriority(id, priority);
      res.json(role);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update role priority' });
    }
  }
} 