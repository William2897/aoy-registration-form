import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { KidsDetail } from "./KidsDetail";
import { TshirtOrder } from "./TshirtOrder";

@Entity("registrations")
export class Registration {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  email!: string;

  @Column()
  fullName!: string;

  @Column()
  dateOfBirth!: Date;

  @Column()
  gender!: string;

  @Column()
  country!: string;

  @Column()
  phone!: string;

  @Column()
  occupationType!: string;

  @Column()
  conference!: string;

  @Column({ nullable: true, type: 'text' })
  otherConference: string | null = null;

  @Column()
  church!: string;

  @Column({ default: false })
  volunteer: boolean = false;

  @Column({ default: false })
  hasKids: boolean = false;

  @OneToMany(() => KidsDetail, kidsDetail => kidsDetail.registration, {
    cascade: true
  })
  kidsDetails!: KidsDetail[];

  @Column({ default: false })
  orderTshirt: boolean = false;

  @OneToMany(() => TshirtOrder, tshirtOrder => tshirtOrder.registration, {
    cascade: true
  })
  tshirtOrders!: TshirtOrder[];

  @Column({ default: false })
  foodAllergies: boolean = false;

  @Column({ nullable: true, type: 'text' })
  allergiesDetails: string | null = null;

  @Column({ default: false })
  healthIssues: boolean = false;

  @Column({ nullable: true, type: 'text' })
  healthDetails: string | null = null;

  @Column()
  paymentMethod!: string;

  @Column({ nullable: true, type: 'text' })
  paymentProofUrl: string | null = null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number = 0;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  kidsTotal: number = 0;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tshirtTotal: number = 0;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number = 0;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount: number = 0;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalTotal: number = 0;

  @Column({ default: false })
  isEarlyBird: boolean = false;

  @Column({ default: false })
  termsAccepted: boolean = false;

  @Column({ default: false })
  isConfirmed: boolean = false;

  @Column({ default: 'pending' })
  status: string = 'pending';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}