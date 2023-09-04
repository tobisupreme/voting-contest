import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { UserSignUpDto } from './dto/sign-up.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Create an account
   */
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() signUpDto: UserSignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  /**
   * Login in to vote
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.identity, signInDto.password);
  }
}
