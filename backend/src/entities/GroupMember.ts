import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Group } from './Group';
import { Role } from './Role';

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  groupId!: string;

  @Column()
  roleId!: string;

  @ManyToOne(() => User, (user: User) => user.groupMemberships)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Group, (group: Group) => group.members)
  @JoinColumn({ name: 'groupId' })
  group!: Group;

  @ManyToOne(() => Role, (role: Role) => role.members)
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @CreateDateColumn()
  joinedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 