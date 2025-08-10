import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcryptjs';
import { UserSignInDto } from './dto/user-signin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  /*<========================================>
     🏳️      Sign Up Part Start        🏳️
  ===========================================>*/
  async signUp(userSignUp: UserSignUpDto): Promise<{ message: string; data: any }> {

    // ইমেইল ডুপ্লিকেট চেক
    const existingUserByEmail = await this.findUserByEmail(userSignUp.email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // ইউজারনেম ডুপ্লিকেট চেক
    const existingUserByName = await this.usersRepository.findOne({
      where: { name: userSignUp.name },
    });
    if (existingUserByName) {
      throw new ConflictException('Username already taken');
    }

    // পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(userSignUp.password, 10);

    // নতুন ইউজার তৈরি
    const user = this.usersRepository.create({
      ...userSignUp,
      password: hashedPassword,
    });

    // ইউজার সেভ করা
    const savedUser = await this.usersRepository.save(user);

    // password বাদ দিয়ে safe object বানানো
    const { password, ...userWithoutPassword } = savedUser;
    return {
      message: 'User created successfully',
      data: {
        userWithoutPassword
      },
    };
  }


  /*<========================================>
     🚩      Sign Up Part End      🚩
  ===========================================>*/
   /*<========================================>
     🏳️      Sign IN Part Start        🏳️
  ===========================================>*/

  async signIn(userSignIn: UserSignInDto): Promise<{ message: string; data: any }> {
    // Find user by email
    const user = await this.findUserByEmail(userSignIn.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(userSignIn.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Password is valid, return user data without password
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'User signed in successfully',
      data: {
        userWithoutPassword
      },
    };
  }
  /*<========================================>
     🚩      Sign IN Part End      🚩
  ===========================================>*/

  // extra part

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }



}
