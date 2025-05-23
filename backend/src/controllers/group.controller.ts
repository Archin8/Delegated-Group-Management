import { Response } from 'express';
import { GroupService } from '../services/group.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class GroupController {
  private groupService = new GroupService();

  async createGroup(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { name, description } = req.body;
      const group = await this.groupService.createGroup({
        name,
        description,
        ownerId: req.user.id,
      });

      res.status(201).json(group);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create group' });
    }
  }

  async getGroup(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const group = await this.groupService.getGroupById(id);
      
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }

      res.json(group);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get group' });
    }
  }

  async updateGroup(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { id } = req.params;
      const group = await this.groupService.updateGroup(id, req.body);
      res.json(group);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update group' });
    }
  }

  async deleteGroup(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { id } = req.params;
      await this.groupService.deleteGroup(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to delete group' });
    }
  }

  async addMember(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { groupId } = req.params;
      const { userId, roleId } = req.body;
      const member = await this.groupService.addMember(groupId, userId, roleId);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to add member' });
    }
  }

  async removeMember(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { groupId, userId } = req.params;
      await this.groupService.removeMember(groupId, userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to remove member' });
    }
  }

  async updateMemberRole(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { groupId, userId } = req.params;
      const { roleId } = req.body;
      const member = await this.groupService.updateMemberRole(groupId, userId, roleId);
      res.json(member);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update member role' });
    }
  }

  async getGroupMembers(req: AuthenticatedRequest, res: Response) {
    try {
      const { groupId } = req.params;
      const members = await this.groupService.getGroupMembers(groupId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get group members' });
    }
  }

  async getUserGroups(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const groups = await this.groupService.getUserGroups(req.user.id);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user groups' });
    }
  }

  async getJoinRequests(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { groupId } = req.params;
      const requests = await this.groupService.getJoinRequests(groupId);
      res.json(requests);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get join requests' });
    }
  }

  async createJoinRequest(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { groupId } = req.params;
      const request = await this.groupService.createJoinRequest(groupId, req.user.id);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create join request' });
    }
  }

  async approveJoinRequest(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { groupId, requestId } = req.params;
      const request = await this.groupService.approveJoinRequest(groupId, requestId);
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to approve join request' });
    }
  }

  async rejectJoinRequest(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { groupId, requestId } = req.params;
      const request = await this.groupService.rejectJoinRequest(groupId, requestId);
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to reject join request' });
    }
  }
} 