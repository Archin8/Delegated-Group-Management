import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({
    type: 'enum',
    enum: ['MEMBERSHIP_CHANGE', 'ROLE_CHANGE', 'JOIN_REQUEST']
  })
  type!: 'MEMBERSHIP_CHANGE' | 'ROLE_CHANGE' | 'JOIN_REQUEST';

  @Column()
  content!: string;

  @Column({ default: false })
  read!: boolean;

  @ManyToOne(() => User, (user: User) => user)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 