import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Business } from './Business';

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @ManyToOne(() => User, (user) => user.activityLogs)
  user: User;

  @ManyToOne(() => Business, (business) => business.activityLogs)
  business: Business;

  @CreateDateColumn()
  createdAt: Date;
} 