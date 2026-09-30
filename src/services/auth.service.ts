import { generateAccessToken } from './token.service.js';

import { createSession, type CreateSessionOptions } from './session.service.js';

import { hashPassword } from './password.service.js';

import { createUser } from './user.service.js';

import { env } from '../config/env.js';
import type { AuthenticationResult } from '../types/index.js';
import type { User } from '../../generated/prisma/client.js';

export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

export async function createAuthentication({
  userId,
  userAgent,
  ipAddress,
}: CreateSessionOptions): Promise<AuthenticationResult> {
  // Authentication state is created through the session service so token and
  // session lifecycle management remain centralized.
  const { session, refreshToken } = await createSession({
    userId,
    userAgent,
    ipAddress,
  });

  // Access and refresh tokens are issued together as part of a successful
  // authentication flow.
  const accessToken = generateAccessToken(userId);

  return {
    accessToken,
    refreshToken,
    session,
  };
}

export async function registerUser({ username, email, password }: RegisterUserData): Promise<User> {
  // Password hashing stays inside the service layer so plaintext passwords
  // never reach the persistence layer.
  const passwordHash = await hashPassword(password);

  return createUser({
    username,
    email,
    passwordHash,
    emailVerifiedAt: env.EMAIL_ENABLED ? null : new Date(),
  });
}
