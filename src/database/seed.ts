import { PrismaClient } from '@prisma/client';
import userSeed from './seed-data/users.seed';

const prisma = new PrismaClient();
const promises = [];

// 1. Seed users
promises.push(
  new Promise(async (resolve, reject) => {
    try {
      await prisma.user.createMany({
        data: userSeed,
      });

      resolve(true);
    } catch (e) {
      reject(e);
    }
  }),
);

Promise.all(promises).catch(console.error);
