import { User } from 'src/schemas/user.schema';

export type UserWithoutPassword = Omit<User, 'password'>;
