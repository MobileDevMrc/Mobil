import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { BusinessModule } from './BusinessModule';
import { StoreOrder } from './StoreOrder';
import { MediaFile } from './MediaFile';
import { ActivityLog } from './ActivityLog';
import { IncomeExpense } from './IncomeExpense';

@Entity()
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  sector: string;

  @OneToMany(() => User, (user) => user.business)
  users: User[];

  @OneToMany(() => BusinessModule, (bm) => bm.business)
  businessModules: BusinessModule[];

  @OneToMany(() => StoreOrder, (order) => order.business)
  storeOrders: StoreOrder[];

  @OneToMany(() => MediaFile, (media) => media.business)
  mediaFiles: MediaFile[];

  @OneToMany(() => ActivityLog, (log) => log.business)
  activityLogs: ActivityLog[];

  @OneToMany(() => IncomeExpense, (ie) => ie.business)
  incomeExpenses: IncomeExpense[];

  @CreateDateColumn()
  createdAt: Date;
} 