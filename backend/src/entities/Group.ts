import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { GroupMember } from './GroupMember';
import { Role } from './Role';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  ownerId!: string;

  @ManyToOne(() => User, (user: User) => user.ownedGroups)
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @OneToMany(() => GroupMember, (groupMember: GroupMember) => groupMember.group)
  members!: GroupMember[];

  @OneToMany(() => Role, (role: Role) => role.group)
  roles!: Role[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 