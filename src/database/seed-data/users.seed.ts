import { faker } from '@faker-js/faker';
import { Gender } from '../../common/interfaces';
import { hashSync } from 'bcrypt';
import { RoleType } from '@prisma/client';

faker.seed(1738);

type IUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: RoleType;
};

function generateUser(): IUser {
  const sex = faker.helpers.arrayElement(Object.values(Gender));
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);
  const saltRounds = 10;
  const plainPassword = faker.internet.password();
  const password = hashSync(plainPassword, saltRounds);

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    email: faker.internet
      .email({
        firstName,
        lastName,
        provider: 'getnada.com',
      })
      .toLowerCase(),
    password,
  };
}

function generateUsers(numberOfUsers = 3): IUser[] {
  return Array.from({ length: numberOfUsers }).map(generateUser);
}
const userSeed = generateUsers();

userSeed[0].role = RoleType.Manager;
export default userSeed;
