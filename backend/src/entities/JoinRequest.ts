import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Group } from './Group';

@Entity('join_requests')
export class JoinRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  groupId!: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  })
  status!: 'PENDING' | 'APPROVED' | 'REJECTED';

  @ManyToOne(() => User, (user: User) => user)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Group, (group: Group) => group)
  @JoinColumn({ name: 'groupId' })
  group!: Group;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 