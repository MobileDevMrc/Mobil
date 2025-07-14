import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Business } from './Business';
import { Module } from './Module';

@Entity()
export class StoreOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Business, (business) => business.storeOrders)
  business: Business;

  @ManyToOne(() => Module, (module) => module.storeOrders)
  module: Module;

  @Column()
  amount: number;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
} 