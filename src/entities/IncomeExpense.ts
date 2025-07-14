import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Business } from './Business';

@Entity()
export class IncomeExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string; // income | expense

  @Column()
  amount: number;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.incomeExpenses)
  user: User;

  @ManyToOne(() => Business, (business) => business.incomeExpenses)
  business: Business;

  @CreateDateColumn()
  createdAt: Date;
} 