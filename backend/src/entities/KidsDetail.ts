//KidsDetail.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Registration } from './Registration';

@Entity('kids_details')
export class KidsDetail {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  dateOfBirth!: Date;

  @Column({ nullable: true })
  healthInfo?: string;

  @ManyToOne(() => Registration, registration => registration.kidsDetails)
  registration!: Registration;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}