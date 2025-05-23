import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Group } from './Group';
import { GroupMember } from './GroupMember';
import { Permission } from '../types';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  groupId!: string;

  @Column('enum', { array: true, enum: Permission })
  permissions!: Permission[];

  @Column()
  priority!: number;

  @Column({ nullable: true })
  parentRoleId!: string;

  @ManyToOne(() => Group, (group: Group) => group.roles)
  @JoinColumn({ name: 'groupId' })
  group!: Group;

  @ManyToOne(() => Role, (role: Role) => role.childRoles)
  @JoinColumn({ name: 'parentRoleId' })
  parentRole!: Role;

  @OneToMany(() => Role, (role: Role) => role.parentRole)
  childRoles!: Role[];

  @OneToMany(() => GroupMember, (groupMember: GroupMember) => groupMember.role)
  members!: GroupMember[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 