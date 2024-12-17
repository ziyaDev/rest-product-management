import { JwtPayload } from './jwt.payload';

export type RequestWithUser = Request & {
  user: JwtPayload;
};
