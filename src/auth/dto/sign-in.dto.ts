import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  identity: string;

  @IsString()
  password: string;
}
