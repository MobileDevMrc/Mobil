import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { BusinessModule } from './BusinessModule';
import { StoreOrder } from './StoreOrder';

@Entity()
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => BusinessModule, (bm) => bm.module)
  businessModules: BusinessModule[];

  @OneToMany(() => StoreOrder, (order) => order.module)
  storeOrders: StoreOrder[];

  @CreateDateColumn()
  createdAt: Date;
} 