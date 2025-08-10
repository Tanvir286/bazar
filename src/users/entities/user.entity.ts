import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class UserEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({select: false})
  password: string;

  @Column({type: 'enum',enum: UserRole,default: [UserRole.USER]})
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
