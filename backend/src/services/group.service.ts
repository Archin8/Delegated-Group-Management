import { AppDataSource } from '../config/database';
import { Group } from '../entities/Group';
import { User } from '../entities/User';
import { GroupMember } from '../entities/GroupMember';
import { Role } from '../entities/Role';
import { Permission } from '../types';
import { JoinRequest } from '../entities/JoinRequest';

export class GroupService {
  private groupRepository = AppDataSource.getRepository(Group);
  private groupMemberRepository = AppDataSource.getRepository(GroupMember);
  private roleRepository = AppDataSource.getRepository(Role);

  async createGroup(data: { name: string; description: string; ownerId: string }): Promise<Group> {
    const group = this.groupRepository.create(data);
    await this.groupRepository.save(group);

    // Create default roles for the group
    const ownerRole = this.roleRepository.create({
      name: 'Owner',
      groupId: group.id,
      permissions: Object.values(Permission),
      priority: 1000,
    });

    const memberRole = this.roleRepository.create({
      name: 'Member',
      groupId: group.id,
      permissions: [Permission.VIEW_GROUP_INFO],
      priority: 100,
    });

    await this.roleRepository.save([ownerRole, memberRole]);

    // Add owner as a member with owner role
    await this.groupMemberRepository.save({
      userId: data.ownerId,
      groupId: group.id,
      roleId: ownerRole.id,
    });

    return group;
  }

  async getGroupById(id: string): Promise<Group | null> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'roles'],
    });
  }

  async updateGroup(id: string, data: Partial<Group>): Promise<Group> {
    const group = await this.getGroupById(id);
    if (!group) {
      throw new Error('Group not found');
    }

    Object.assign(group, data);
    return this.groupRepository.save(group);
  }

  async deleteGroup(id: string): Promise<void> {
    const result = await this.groupRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Group not found');
    }
  }

  async addMember(groupId: string, userId: string, roleId: string): Promise<GroupMember> {
    const existingMember = await this.groupMemberRepository.findOne({
      where: { groupId, userId },
    });

    if (existingMember) {
      throw new Error('User is already a member of this group');
    }

    const member = this.groupMemberRepository.create({
      userId,
      groupId,
      roleId,
    });

    return this.groupMemberRepository.save(member);
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    const result = await this.groupMemberRepository.delete({ groupId, userId });
    if (result.affected === 0) {
      throw new Error('Member not found');
    }
  }

  async updateMemberRole(groupId: string, userId: string, roleId: string): Promise<GroupMember> {
    const member = await this.groupMemberRepository.findOne({
      where: { groupId, userId },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    member.roleId = roleId;
    return this.groupMemberRepository.save(member);
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    return this.groupMemberRepository.find({
      where: { groupId },
      relations: ['user', 'role'],
    });
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const memberships = await this.groupMemberRepository.find({
      where: { userId },
      relations: ['group'],
    });

    return memberships.map(membership => membership.group);
  }

  async getJoinRequests(groupId: string): Promise<JoinRequest[]> {
    const joinRequestRepository = AppDataSource.getRepository(JoinRequest);
    return joinRequestRepository.find({
      where: { groupId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async createJoinRequest(groupId: string, userId: string): Promise<JoinRequest> {
    const joinRequestRepository = AppDataSource.getRepository(JoinRequest);
    
    // Check if user is already a member
    const memberRepository = AppDataSource.getRepository(GroupMember);
    const existingMember = await memberRepository.findOne({
      where: { userId, groupId },
    });

    if (existingMember) {
      throw new Error('User is already a member of this group');
    }

    // Check if there's already a pending request
    const existingRequest = await joinRequestRepository.findOne({
      where: { userId, groupId, status: 'PENDING' },
    });

    if (existingRequest) {
      throw new Error('User already has a pending join request');
    }

    const request = joinRequestRepository.create({
      userId,
      groupId,
      status: 'PENDING',
    });

    return joinRequestRepository.save(request);
  }

  async approveJoinRequest(groupId: string, requestId: string): Promise<JoinRequest> {
    const joinRequestRepository = AppDataSource.getRepository(JoinRequest);
    const request = await joinRequestRepository.findOne({
      where: { id: requestId, groupId },
    });

    if (!request) {
      throw new Error('Join request not found');
    }

    if (request.status !== 'PENDING') {
      throw new Error('Join request is not pending');
    }

    request.status = 'APPROVED';
    await joinRequestRepository.save(request);

    // Add user as a member with default role
    const roleRepository = AppDataSource.getRepository(Role);
    const defaultRole = await roleRepository.findOne({
      where: { groupId, name: 'Member' },
    });

    if (!defaultRole) {
      throw new Error('Default role not found');
    }

    await this.addMember(groupId, request.userId, defaultRole.id);

    return request;
  }

  async rejectJoinRequest(groupId: string, requestId: string): Promise<JoinRequest> {
    const joinRequestRepository = AppDataSource.getRepository(JoinRequest);
    const request = await joinRequestRepository.findOne({
      where: { id: requestId, groupId },
    });

    if (!request) {
      throw new Error('Join request not found');
    }

    if (request.status !== 'PENDING') {
      throw new Error('Join request is not pending');
    }

    request.status = 'REJECTED';
    return joinRequestRepository.save(request);
  }
} 