import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { GroupMember } from '../entities/GroupMember';

export interface AuthenticatedRequest extends Request {
  user?: User;
  groupMember?: GroupMember;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const payload = verifyToken(token);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: payload.userId } });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}; 