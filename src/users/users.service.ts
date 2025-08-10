import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUp } from './dto/user-signup.dto';

@Injectable()
export class UsersService {


   constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

    /*<========================================>
       🏳️      Sign Up Part Start        🏳️
    ===========================================>*/
   
    async signUp(userSignUp: UserSignUp): Promise<{ message: string; data: UserEntity }> {
    
      const user = this.usersRepository.create(userSignUp);

      // ইমেইল ডুপ্লিকেট চেক
      const existingUserByEmail = await this.usersRepository.findOne({
        where: { email: userSignUp.email },
      });
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


      // সব ঠিক থাকলে ইউজার তৈরি করো
      const savedUser = await this.usersRepository.save(user);
      return {
        message: 'User created successfully',
        data: savedUser,
      };

    }

  /*<========================================>
       🚩      Sign Up Part End      🚩
   ===========================================>*/

}
