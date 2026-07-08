import passport from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Profile as GitHubProfile } from 'passport-github2';
import { authService } from '@services/auth.service.js';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  SERVER_URL
} from '@utils/config.util.js';


passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/api/auth/google/callback`,
    },
    async (_accessToken: string, _refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
      try {
        const payload = {
          sub: profile.id,
          email: profile.emails?.[0]?.value || '',
          name: profile.displayName || '',
          picture: profile.photos?.[0]?.value || '',
        };
        const result = await authService.handleGoogleSignIn(payload);
        done(null, result);
      } catch (err) {
        done(err as Error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/api/auth/github/callback`,
    },
    async (_accessToken: string, _refreshToken: string, profile: GitHubProfile, done: (err: Error | null, user?: any) => void) => {
      try {
        const payload = {
          githubId: profile.id,
          email: profile.emails?.[0]?.value || '',
          name: profile.displayName || profile.username || '',
          picture: profile.photos?.[0]?.value || '',
        };
        const result = await authService.handleGithubSignIn(payload);
        done(null, result);
      } catch (err) {
        done(err as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: Error | null, id?: any) => void) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: (err: Error | null, user?: any) => void) => {
  done(null, user);
});

export default passport;
