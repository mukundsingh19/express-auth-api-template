import { AppError } from '../errors/AppError.js';
import type { AuthProvider } from '../../generated/prisma/enums.js';
import type { User } from '../../generated/prisma/client.js';
import type { FindOrCreateOAuthUserParams } from '../services/oauth.service.js';
import type { Profile as GoogleProfile } from 'passport-google-oauth20';

export interface ProcessGoogleProfileContext {
  findOrCreateOAuthUser: (params: FindOrCreateOAuthUserParams) => Promise<User>;
  provider: AuthProvider;
}

export async function processGoogleProfile(
  profile: GoogleProfile,
  { findOrCreateOAuthUser, provider }: ProcessGoogleProfileContext,
): Promise<User> {
  // Google must provide a verified email address because the email is used
  // to identify and associate the OAuth account with a local user account.
  const emailData = profile.emails?.[0];

  if (
    !emailData?.value ||
    !(emailData as { verified?: boolean | string; value: string }).verified
  ) {
    throw new AppError(
      'A verified email address is required to use Google login.',
      401,
      'OAUTH_EMAIL_REQUIRED',
    );
  }

  // Normalize provider data into the application-specific OAuth user shape.
  return findOrCreateOAuthUser({
    provider,
    providerAccountId: profile.id,
    email: emailData.value.toLowerCase(),
    displayName: profile.displayName || null,
    avatarUrl: profile.photos?.[0]?.value || null,
  });
}
