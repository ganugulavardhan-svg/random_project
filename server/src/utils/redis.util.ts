// lib/redis.ts
import Redis from "ioredis";

const redis = new Redis.default({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
});

export const redisKeys = {
  // Email verification tokens (alternative to DB, for quick expiry)
  emailVerificationToken: (token: string) => `email_verification:${token}`,
  emailVerificationByUser: (userId: string) => `email_verification:user:${userId}`,
  
  // Password reset tokens
  passwordResetToken: (token: string) => `password_reset:${token}`,
  passwordResetByUser: (userId: string) => `password_reset:user:${userId}`,
  
  // Sessions (prefer DB but cache in Redis for speed)
  sessionToken: (token: string) => `session:${token}`,
  userSessions: (userId: string) => `sessions:user:${userId}`,
  
  // Rate limiting
  loginAttempts: (identifier: string) => `login_attempts:${identifier}`,
  signupAttempts: (email: string) => `signup_attempts:${email}`,
  emailVerifyAttempts: (email: string) => `email_verify_attempts:${email}`,
  
  // Email deduplication (prevent duplicate signup requests)
  pendingSignupEmail: (email: string) => `pending_signup:${email}`,
};

export default redis;