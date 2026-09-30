import { commonSchemas } from './common.schemas.js';
import { errorSchemas } from './error.schemas.js';
import { authSchemas } from './auth.schemas.js';
import { userSchemas } from './user.schemas.js';

export const openApiSchemas = {
  ...commonSchemas,
  ...errorSchemas,
  ...authSchemas,
  ...userSchemas,
};
