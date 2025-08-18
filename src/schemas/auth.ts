import { z } from "zod";

// Common validation patterns
const emailSchema = z
  .string()
  .email("Invalid email format")
  .toLowerCase()
  .trim();
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(128, "Password too long");
const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name too long")
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
    .min(1, "Workspace name is required")
    .max(100, "Workspace name too long")
    .trim(),
  adminName: nameSchema,
  workspaceLogo: z
    .string()
    .url("Invalid logo URL")
    .optional()
    .or(z.literal("")),
  role: z.number().int().positive("Role must be a positive integer"),
  departments: z
    .array(
      z.number().int().positive("Department ID must be a positive integer")
    )
    .min(1, "At least one department is required"),
  designations: z
    .array(
      z.number().int().positive("Designation ID must be a positive integer")
    )
    .min(1, "At least one designation is required"),
  shifts: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "Shift name is required")
          .max(50, "Shift name too long")
          .trim(),
        description: z.string().max(200, "Description too long").optional(),
        startTime: z
          .string()
          .regex(
            /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Invalid start time format (HH:MM)"
          ),
        endTime: z
          .string()
          .regex(
            /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Invalid end time format (HH:MM)"
          ),
      })
    )
    .min(1, "At least one shift is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
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
    token: z.string().min(1, "Reset token is required"),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
