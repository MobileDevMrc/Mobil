import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Business } from './Business';
import { ActivityLog } from './ActivityLog';
import { MediaFile } from './MediaFile';
import { IncomeExpense } from './IncomeExpense';

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ManyToOne(() => Business, (business) => business.users)
  business: Business;

  @OneToMany(() => ActivityLog, (log) => log.user)
  activityLogs: ActivityLog[];

  @OneToMany(() => MediaFile, (media) => media.user)
  mediaFiles: MediaFile[];

  @OneToMany(() => IncomeExpense, (ie) => ie.user)
  incomeExpenses: IncomeExpense[];

  @CreateDateColumn()
  createdAt: Date;
} 