import passport from 'passport';
import { Strategy as GitHubStrategy, type Profile as GitHubProfile } from 'passport-github2';

import { AuthProvider } from '../../generated/prisma/enums.js';
import { env } from '../config/env.js';
import { findOrCreateOAuthUser } from '../services/oauth.service.js';
import { processGitHubProfile } from './github-profile.js';

export function configureGitHubStrategy(): void {
  // OAuth strategies are optional. Skip registration when the provider has not
  // been configured so applications can use only the authentication providers they need.
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET || !env.GITHUB_CALLBACK_URL) {
    return;
  }

  // Passport handles the provider-specific OAuth flow; profile normalization
  // and user/account persistence are delegated to separate modules.
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: env.GITHUB_CALLBACK_URL,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: GitHubProfile,
        done: (error: unknown, user?: Express.User | false | null) => void,
      ) => {
        try {
          const user = await processGitHubProfile(profile, {
            findOrCreateOAuthUser,
            provider: AuthProvider.GITHUB,
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}
