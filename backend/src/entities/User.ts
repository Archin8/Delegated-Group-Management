import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { GroupMember } from './GroupMember';
import { Group } from './Group';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ default: false })
  isAdmin!: boolean;

  @OneToMany(() => Group, (group: Group) => group.owner)
  ownedGroups!: Group[];

  @OneToMany(() => GroupMember, (groupMember: GroupMember) => groupMember.user)
  groupMemberships!: GroupMember[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 