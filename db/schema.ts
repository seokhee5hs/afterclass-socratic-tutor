// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(), name: text('name').notNull(), studentId: text('student_id').notNull(), email: text('email').notNull(),
  topic: text('topic').notNull(), question: text('question').notNull(), transcript: text('transcript').notNull().default('[]'),
  status: text('status').notNull().default('new'), answer: text('answer').notNull().default(''),
  createdAt: text('created_at').notNull(), answeredAt: text('answered_at'),
}, t => [index('idx_questions_created').on(t.createdAt)]);
export const settings = sqliteTable('settings', { id: text('id').primaryKey(), value: text('value').notNull() });
export const limits = sqliteTable('limits', { key: text('key').primaryKey(), count: integer('count').notNull(), expires: integer('expires').notNull() });
