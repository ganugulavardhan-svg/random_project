import { db } from '@db/index.js'; 
import { users, accounts } from '@db/schema.js';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const SALT_ROUNDS = 10;


function generateDefaultUsername(): string {
  return `vandron_${Math.random().toString(36).substring(2, 8)}`;
}

export class AuthService {
  
 
  async registerWithPassword(email: string, password: string) {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser) throw new Error('Email already registered.');

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Create user (unverified)
    const [newUser] = await db.insert(users).values({
      email,
      username: generateDefaultUsername(),
      isVerified: false, 
    }).returning();

    // Link password account
    await db.insert(accounts).values({
      userId: newUser.id,
      provider: 'credentials',
      providerAccountId: email,
      passwordHash: hashedPassword,
    });

    // Generate Verification Token & save to Redis (expires in 24 hours)
    const verificationToken = uuidv4();
    await redis.set(`verify:${verificationToken}`, newUser.id, 'EX', 86400);

    // TODO: Trigger your email provider here (e.g., Resend / Nodemailer)
    // sendVerificationEmail(email, verificationToken);

    return { message: "Registration successful. Please check your email to verify your account." };
  }

  /**
   * 2. LOGIN VIA PASSWORD
   */
  async loginWithPassword(email: string, password: string) {
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];
    if (!user) throw new Error('Invalid email or password.');

    // Enforce Verification Guard
    if (!user.isVerified) throw new Error('Account not verified. Please check your email.');

    const accountResult = await db.select().from(accounts).where(and(eq(accounts.userId, user.id), eq(accounts.provider, 'credentials'))).limit(1);
    const account = accountResult[0];
    if (!account || !account.passwordHash) throw new Error('Invalid credentials setup.');

    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) throw new Error('Invalid email or password.');

    return this.createUserSession(user.id);
  }

  /**
   * 3. GOOGLE OAUTH SIGN-IN / UP (Handles seamless linkage)
   */
  async handleGoogleSignIn(googlePayload: { sub: string; email: string; name: string; picture: string }) {
    const { sub, email, name, picture } = googlePayload;

    // Step A: Check if the user already exists by email
    let userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

    if (user) {
      // User exists! If they haven't verified via email yet, Google OAuth auto-verifies them.
      if (!user.isVerified) {
        await db.update(users).set({ isVerified: true }).where(eq(users.id, user.id));
        user.isVerified = true;
      }

      // Check if this specific Google account is already linked
      const existingAccountResult = await db.select().from(accounts).where(and(eq(accounts.userId, user.id), eq(accounts.provider, 'google'))).limit(1);
      const existingAccount = existingAccountResult[0];

      // Seamless Linkage: If they signed up with password before, link Google now
      if (!existingAccount) {
        await db.insert(accounts).values({
          userId: user.id,
          provider: 'google',
          providerAccountId: sub,
        });
      }
    } else {
      // Step B: Brand new user registers via Google -> Auto-verified, gets profile pic
      const userResult = await db.insert(users).values({
        email,
        username: generateDefaultUsername(),
        displayName: name,
        profilePicture: picture,
        isVerified: true, // Google accounts skip manual email verification
      }).returning();

      const user = userResult[0];

      await db.insert(accounts).values({
        userId: user.id,
        provider: 'google',
        providerAccountId: sub,
      });
    }

    return this.createUserSession(user.id);
  }

  /**
   * 4. EMAIL VERIFICATION CONFIRMATION
   */
  async verifyEmailToken(token: string) {
    const userId = await redis.get(`verify:${token}`);
    if (!userId) throw new Error('Invalid or expired verification token.');

    await db.update(users).set({ isVerified: true }).where(eq(users.id, userId));
    await redis.del(`verify:${token}`); // Clean up token

    return { message: "Account successfully verified!" };
  }

  /**
   * Redis Session Helper
   */
  private async createUserSession(userId: string) {
    const sessionId = uuidv4();
    // Cache user session in Redis for fast access (e.g., 7 days lifetime)
    await redis.set(`session:${sessionId}`, JSON.stringify({ userId }), 'EX', 604800);
    return { sessionId, userId };
  }
}