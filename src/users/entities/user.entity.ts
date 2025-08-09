import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


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

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({type: 'enum',enum: UserRole,default: [UserRole.USER]})
  role: UserRole;

}
