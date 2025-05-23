import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { AppDataSource } from '../config/database';
import { GroupMember } from '../entities/GroupMember';
import { Permission } from '../types';

export const checkPermission = (requiredPermission: Permission) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const groupId = req.params.groupId;
      if (!groupId) {
        return res.status(400).json({ message: 'Group ID is required' });
      }

      const groupMemberRepository = AppDataSource.getRepository(GroupMember);
      const member = await groupMemberRepository.findOne({
        where: { userId: req.user.id, groupId },
        relations: ['role'],
      });

      if (!member) {
        return res.status(403).json({ message: 'User is not a member of this group' });
      }

      if (!member.role.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: 'User does not have the required permission' });
      }

      // Attach the member information to the request for potential use in the route handler
      req.groupMember = member;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Error checking permissions' });
    }
  };
};

// Helper middleware to check if user is the group owner
export const checkGroupOwner = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const groupId = req.params.groupId;
    if (!groupId) {
      return res.status(400).json({ message: 'Group ID is required' });
    }

    const groupMemberRepository = AppDataSource.getRepository(GroupMember);
    const member = await groupMemberRepository.findOne({
      where: { userId: req.user.id, groupId },
      relations: ['role'],
    });

    if (!member) {
      return res.status(403).json({ message: 'User is not a member of this group' });
    }

    // Check if the role name is 'Owner' (case-insensitive)
    if (member.role.name.toLowerCase() !== 'owner') {
      return res.status(403).json({ message: 'Only group owners can perform this action' });
    }

    req.groupMember = member;
    next();
  } catch (error) {
    console.error('Group owner check error:', error);
    res.status(500).json({ message: 'Error checking group ownership' });
  }
}; 