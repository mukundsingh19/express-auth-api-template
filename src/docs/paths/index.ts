import { healthPaths } from './health.paths.js';
import { authPaths } from './auth.paths.js';
import { userPaths } from './user.paths.js';

export const openApiPaths = {
  ...healthPaths,
  ...authPaths,
  ...userPaths,
};
