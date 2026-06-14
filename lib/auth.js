import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import dbModule from './db/index.js';
import { credentialsSchema } from './validate.js';

const { db, authSchema, schema } = dbModule;

const googleProvider = process.env.AUTH_GOOGLE_ID
  ? Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    })
  : null;

const providers = [
  Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Parola', type: 'password' },
    },
    async authorize(credentials) {
      if (!db) {
        return null;
      }

      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) {
        return null;
      }

      const { email, password } = parsed.data;
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1);

      if (!user || user.bannedAt || !user.passwordHash) {
        return null;
      }

      const passwordMatches = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatches) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role || 'user',
        banned: Boolean(user.bannedAt),
      };
    },
  }),
];

if (googleProvider) {
  providers.push(googleProvider);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: db ? DrizzleAdapter(db, authSchema) : undefined,
  session: {
    strategy: 'jwt',
  },
  providers,
  secret: process.env.AUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === 'true',
  pages: {
    signIn: '/account/auth',
  },
  callbacks: {
    async signIn({ user }) {
      return !user?.bannedAt && !user?.banned;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
        token.banned = Boolean(user.bannedAt || user.banned);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || session.user.id || null;
        session.user.role = token.role || 'user';
        session.user.banned = Boolean(token.banned);
      }

      return session;
    },
  },
});
