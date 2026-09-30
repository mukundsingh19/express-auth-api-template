import type { User as PrismaUser } from '../../generated/prisma/client.js';

export type User = PrismaUser;

export type SanitizedUser = {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  emailVerifiedAt?: Date | null;
};

export interface AccessTokenPayload {
  sub: string;
  type: 'access';
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  sid: string;
  type: 'refresh';
  jti: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticationResult {
  accessToken: string;
  refreshToken: string;
  session: {
    id: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    lastUsedAt: Date | null;
    userAgent: string | null;
    ipAddress: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}
