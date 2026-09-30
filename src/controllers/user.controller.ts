import type { Request, Response, NextFunction } from 'express';
import {
  changeUserPassword,
  updateUserProfile,
  changeUsername,
  deleteUserAccount,
} from '../services/user.service.js';

import { requestEmailChange, confirmEmailChange } from '../services/email-change.service.js';

import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookies.js';
import { AppError } from '../errors/AppError.js';

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'AUTHENTICATION_REQUIRED');
    }

    const { displayName, avatarUrl } = req.body;

    const user = await updateUserProfile({
      userId: req.user.id,
      displayName,
      avatarUrl,
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'AUTHENTICATION_REQUIRED');
    }

    const { currentPassword, newPassword } = req.body;

    // Changing the password invalidates the user's existing sessions, so the
    // client must authenticate again with the new credentials.
    await changeUserPassword({
      userId: req.user.id,
      currentPassword,
      newPassword,
    });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please log in again.',
    });
  } catch (error) {
    return next(error);
  }
}

export async function changeUsernameController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'AUTHENTICATION_REQUIRED');
    }

    const { username } = req.body;

    const user = await changeUsername({
      userId: req.user.id,
      username,
    });

    return res.status(200).json({
      success: true,
      message: 'Username updated successfully.',
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function requestEmailChangeController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'AUTHENTICATION_REQUIRED');
    }

    const { email } = req.body;

    // Email changes require verification of the new address before the account
    // email is updated.
    await requestEmailChange(req.user.id, email);

    return res.status(200).json({
      success: true,
      message: 'If the email can be changed, a verification email will be sent.',
    });
  } catch (error) {
    return next(error);
  }
}

export async function confirmEmailChangeController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'AUTHENTICATION_REQUIRED');
    }

    const { token } = req.body;

    await confirmEmailChange(req.user.id, token);

    return res.status(200).json({
      success: true,
      message: 'Email address changed successfully.',
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401, 'AUTHENTICATION_REQUIRED');
    }

    const { currentPassword } = req.body;

    // Account deletion also invalidates the current authentication cookies so the
    // deleted account cannot remain authenticated in the client.
    await deleteUserAccount({
      userId: req.user.id,
      currentPassword,
    });

    res.clearCookie('accessToken', accessTokenCookieOptions);
    res.clearCookie('refreshToken', refreshTokenCookieOptions);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
