import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Business } from './Business';

@Entity()
export class MediaFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  type: string;

  @ManyToOne(() => User, (user) => user.mediaFiles)
  user: User;

  @ManyToOne(() => Business, (business) => business.mediaFiles)
  business: Business;

  @CreateDateColumn()
  createdAt: Date;
} 