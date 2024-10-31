//TshirtOrder.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Registration } from './Registration';

@Entity('tshirt_orders')
export class TshirtOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  size!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @ManyToOne(() => Registration, registration => registration.tshirtOrders)
  registration!: Registration;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}