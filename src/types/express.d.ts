import type { User as PrismaUser } from '../../generated/prisma/client.js';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends PrismaUser {}

    interface Request {
      user?: PrismaUser;
      cookies: Record<string, string | undefined>;
    }
  }
}

export {};
