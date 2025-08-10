import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  Length 
} from 'class-validator';

export class UserSignUp {

  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Length(4, 10, { message: 'Password must be between 6 and 10 characters' })
  password: string;

}
