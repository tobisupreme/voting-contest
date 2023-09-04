import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { UserSignUpDto } from './dto/sign-up.dto';
import { Public } from '../common/decorators/auth.public.decorator';
import { ApiResponseMetadata } from '../common/decorators/response.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Create an account
   */
  @ApiResponseMetadata({
    message: 'Sign-up successful',
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() signUpDto: UserSignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  /**
   * Login in to vote
   */
  @ApiResponseMetadata({
    message: 'Login successful',
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.identity, signInDto.password);
  }

  @ApiBearerAuth()
  @Post('/seed:file')
  seedFile(@Param('file') seed: string) {
    return this.authService.runSeed(seed);
  }
}
