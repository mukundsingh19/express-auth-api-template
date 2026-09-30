import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ZodType } from 'zod';

export function validate(schema: ZodType): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(result.error);
    }

    // Replace the raw request body with Zod's parsed output so downstream
    // handlers receive normalized and validated data.
    req.body = result.data;

    return next();
  };
}
