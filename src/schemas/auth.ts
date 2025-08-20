import { z } from 'zod';
import { constants } from '@config';

// Common validation patterns
const emailSchema = z
  .string()
  .email('Invalid email format')
  .toLowerCase()
  .trim()
  .max(constants.VALIDATION_CONSTANTS.STRING.EMAIL_MAX_LENGTH, 'Email too long');

const passwordSchema = z
  .string()
  .min(
    constants.VALIDATION_CONSTANTS.STRING.PASSWORD_MIN_LENGTH,
    `Password must be at least ${constants.VALIDATION_CONSTANTS.STRING.PASSWORD_MIN_LENGTH} characters`
  )
  .max(constants.VALIDATION_CONSTANTS.STRING.PASSWORD_MAX_LENGTH, 'Password too long');

const nameSchema = z
  .string()
  .min(constants.VALIDATION_CONSTANTS.STRING.MIN_LENGTH, 'Name is required')
  .max(constants.VALIDATION_CONSTANTS.STRING.MAX_LENGTH, 'Name too long')
  .trim();

// Login schema
export const loginSchema = z.object({
  emailId: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;

// Signup schema
export const signupSchema = z.object({
  emailId: emailSchema,
  password: passwordSchema,
  workspaceName: z
    .string()
    .min(constants.VALIDATION_CONSTANTS.STRING.MIN_LENGTH, 'Workspace name is required')
    .max(constants.VALIDATION_CONSTANTS.STRING.MAX_LENGTH, 'Workspace name too long')
    .trim(),
  adminName: nameSchema,
  workspaceLogo: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  role: z.number().int().positive('Role must be a positive integer'),
  departments: z
    .array(z.number().int().positive('Department ID must be a positive integer'))
    .min(1, 'At least one department is required'),
  designations: z
    .array(z.number().int().positive('Designation ID must be a positive integer'))
    .min(1, 'At least one designation is required'),
  shifts: z
    .array(
      z.object({
        name: z
          .string()
          .min(constants.VALIDATION_CONSTANTS.STRING.MIN_LENGTH, 'Shift name is required')
          .max(50, 'Shift name too long')
          .trim(),
        description: z.string().max(200, 'Description too long').optional(),
        startTime: z
          .string()
          .regex(constants.TIME_CONSTANTS.REGEX.TIME_24H, 'Invalid start time format (HH:MM)'),
        endTime: z
          .string()
          .regex(constants.TIME_CONSTANTS.REGEX.TIME_24H, 'Invalid end time format (HH:MM)'),
      })
    )
    .min(1, 'At least one shift is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
  emailId: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset password schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
