import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { join } from 'path';
import { argv } from 'process';
import { SeedRunner } from './runners/interface';

const baseDir = join(__dirname, './runners');
const args = argsParser(argv);

if (!Object.entries(args).length) {
  console.error('No args passed!');
  process.exit();
}
if (!args['seed-file']) {
  console.error('--seed-file= argument not provided!');
  process.exit();
}

const promises = [];
const prisma = new PrismaClient();

promises.push(
  new Promise(async (res, rej) => {
    try {
      // load seed file
      const seedFilePath = join(baseDir, `${args['seed-file']}.runner.ts`);
      if (!existsSync(seedFilePath)) {
        throw new Error(`-> seed file '${seedFilePath}' does not exists!`);
      }

      const runner = new (await import(seedFilePath)).default(prisma);
      if (!(runner instanceof SeedRunner)) {
        throw new Error('-> seed file does not contain any runner.');
      }

      await runner.run();

      res(true);
    } catch (e) {
      console.log('Unable to complete runner');
      rej(e);
    }
  }),
);

Promise.all(promises)
  .catch((e) => {
    console.log('exiting...');
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    console.log('-> custom DB Seeding ran successfully!');
    process.exit(0);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function argsParser(args: string[]) {
  if (!args[2]) {
    return null;
  }
  const returnVal = args.reduce((args, arg: string) => {
    if (!arg.startsWith('--')) return args;
    const [iKey, value] = arg.split('=');
    if (!iKey || !value) return args;

    const key = iKey.slice(2);
    return { [key]: value };
  }, {});
  return returnVal;
}
