import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import type { User } from '../../generated/prisma/client.js';

export function authenticateLocal(req: Request, res: Response, next: NextFunction): void {
  // Passport performs credential verification here; the application does not
  // create a session through Passport, so session support remains disabled.
  passport.authenticate(
    'local',
    { session: false },
    (error: unknown, user?: User | false | null, info?: { message?: string }) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || 'Authentication failed.',
        });
      }

      req.user = user;

      return next();
    },
  )(req, res, next);
}
