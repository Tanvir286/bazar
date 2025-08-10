import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  /*<========================================>
       🏳️       Sign Up Part Start        🏳️
  ===========================================>*/
  async signUp(userSignUp: UserSignUpDto): Promise<{ message: string; data: any }> {

    // ইমেইল দিয়ে ইউজার আছে কিনা চেক করা
    const existingUserByEmail = await this.findUserByEmail(userSignUp.email);
    if (existingUserByEmail) throw new ConflictException('Email already exists');

    // নাম দিয়ে ইউজার আছে কিনা চেক করা
    const existingUserByName = await this.usersRepository.findOne({ where: { name: userSignUp.name } });
    if (existingUserByName) throw new ConflictException('Username already taken');

    // পাসওয়ার্ড hash করা (bcrypt ব্যবহার করে)
    const hashedPassword = await bcrypt.hash(userSignUp.password, 10);

    const user = this.usersRepository.create({
      ...userSignUp,
      password: hashedPassword,
    });
    // ইউজার ডাটাবেসে সেভ করা হয়েছে
    const savedUser = await this.usersRepository.save(user);
    // রেসপন্সে পাসওয়ার্ড বাদ দিয়ে অন্য ডাটা পাঠানো
    const { password, ...userWithoutPassword } = savedUser;

    return {
      message: 'User created successfully',
      data: userWithoutPassword,
    };
  }
  /*<========================================>
       🚩       Sign Up Part End      🚩
  ===========================================>*/
  /*<========================================>
       🏳️       Sign In Part Start       🏳️
  ===========================================>*/

  async signIn(userSignIn: UserSignInDto): Promise<{ message: string; data: any; accessToken: string }> {
   
    // ইমেইল দিয়ে ইউজার আছে কিনা চেক করা
    const user = await this.usersRepository.findOne({
      where: { email: userSignIn.email }
    });

    if (!user) throw new NotFoundException('User not found');

    // ইনপুট পাসওয়ার্ড ও ডাটাবেস পাসওয়ার্ড মিলানো
    const isPasswordValid = await bcrypt.compare(userSignIn.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const { password, ...userWithoutPassword } = user;

    // JWT Token জেনারেট
    const payload = { UserId: user.id, email: user.email }; // টোকেনের জন্য পে-লোড তৈরি 
    const accessToken = this.jwtService.sign(payload);   // JWT টোকেন সাইন করা হয়েছে

    return {
      message: 'User signed in successfully',
      data: userWithoutPassword,
      accessToken,
    };
  }
  /*<========================================>
       🚩       Sign Up Part End      🚩
  ===========================================>*/
  /*<========================================>
       🏳️       Find All Users Start       🏳️
  ===========================================>*/

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }
  /*<========================================>
       🚩       Find All Users End      🚩
  ===========================================>*/
  /*<========================================>
       🏳️       Find One Users Start       🏳️
  ===========================================>*/

  async findOne(id:number ): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
   /*<========================================>
       🚩       Find All Users End      🚩
  ===========================================>*/



  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }
}
