import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUp } from './dto/user-signup.dto';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  /*🏳️<===============(Sign Up Start)===============>🏳️*/
  @Post('signup')
  async signUp(@Body() userSignUp: UserSignUp) {
    return this.usersService.signUp(userSignUp);
  }
  /*🏳️<===============(Sign Up End)===============>🏳️*/
   


  
}
