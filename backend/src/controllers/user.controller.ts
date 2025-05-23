import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class UserController {
  private userService = new UserService();

  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const result = await this.userService.register({
        email,
        password,
        firstName,
        lastName,
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error instanceof Error ? error.message : 'Login failed' });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      const user = await this.userService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user profile' });
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      const updatedUser = await this.userService.updateUser(req.user.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Update failed' });
    }
  }

  async deleteProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      await this.userService.deleteUser(req.user.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Deletion failed' });
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      const { currentPassword, newPassword } = req.body;
      await this.userService.changePassword(req.user.id, currentPassword, newPassword);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Password change failed' });
    }
  }

  // Admin-only endpoints
  async getUsers(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get users' });
    }
  }

  async createUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const { email, password, firstName, lastName } = req.body;
      const user = await this.userService.createUser({
        email,
        password,
        firstName,
        lastName,
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'User creation failed' });
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const { id } = req.params;
      const updatedUser = await this.userService.updateUser(id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Update failed' });
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const { id } = req.params;
      await this.userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Deletion failed' });
    }
  }
} 