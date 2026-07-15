import { pgTable, uuid, text, integer, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull(), 
  displayName: text('display_name').notNull().default('vandron'),
  profilePicture: text('profile_picture'),
  isVerified: boolean('is_verified').default(false).notNull(),
  credits: integer('credits').default(0).notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  provider: text('provider').notNull(), // 'credentials', 'google', 'github', etc.
  providerAccountId: text('provider_account_id').notNull(), // email for password, sub id for google
  passwordHash: text('password_hash'), // Only filled if provider is 'credentials'
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('provider_account_idx').on(table.provider, table.providerAccountId)
]);