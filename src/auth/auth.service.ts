import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserSignUpDto } from './dto/sign-up.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AppUtilities } from '../app.utilities';
import { execSync } from 'child_process';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signUp({ password, ...dto }: UserSignUpDto) {
    const passwordHash: string = await AppUtilities.hashAuthSecret(password);
    const newUser: User = await this.prisma.user.create({
      data: { ...dto, password: passwordHash },
    });
    delete newUser.password;
    delete newUser.role;

    const token = await this.signPayload({ sub: newUser.id });
    return { token, user: newUser };
  }

  async signIn(identity: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(identity);
    const isMatch = user
      ? await AppUtilities.validatePassword(password, user.password)
      : false;
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date().toISOString(),
      },
    });

    const token = await this.signPayload({ sub: user.id });
    return { token };
  }

  private async signPayload(payload: { sub: string }): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async runSeed(seedFile: string) {
    try {
      execSync(`yarn db:seed-runner --seed-file=${seedFile}`);
    } catch (e) {
      throw e;
    }
  }
}
