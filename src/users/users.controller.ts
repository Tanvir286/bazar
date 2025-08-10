import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  /*🏳️<===============(Sign Up Start)===============>🏳️*/
  @Post('signup')
  async signUp(@Body() userSignUp: UserSignUpDto) {
    return this.usersService.signUp(userSignUp);
  }
  /*🏳️<===============(Sign Up End)===============>🏳️*/
  /*🏳️<===============(Sign In Start)===============>🏳️*/
  @Post('signin')
  async signIn(@Body() userSignIn: UserSignInDto) {
    return this.usersService.signIn(userSignIn);
  }
  /*🏳️<===============(Sign Up End)===============>🏳️*/
  /*🏳️<===============(All User Get Start)===============>🏳️*/
  @Get('alluser')
  async findAll() {
    return this.usersService.findAll();
  }
  /*🏳️<===============(All User Get End)===============>🏳️*/
}
