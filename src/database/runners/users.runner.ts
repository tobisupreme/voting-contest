import { SeedRunner } from './interface';
import userSeed from '../seed-data/users.seed';
import { PrismaClient } from '@prisma/client';

export default class UserSeedRunner extends SeedRunner {
  constructor(private prisma: PrismaClient) {
    super();
  }

  async run() {
    return Promise.all([
      this.prisma.user.createMany({
        data: userSeed,
        skipDuplicates: true,
      }),
    ]);
  }
}
