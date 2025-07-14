import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Business } from './Business';
import { Module } from './Module';

@Entity()
export class BusinessModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Business, (business) => business.businessModules)
  business: Business;

  @ManyToOne(() => Module, (module) => module.businessModules)
  module: Module;

  @CreateDateColumn()
  createdAt: Date;
} 