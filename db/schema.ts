import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const problemCases=sqliteTable('problem_cases',{owner:text('owner').primaryKey(),payload:text('payload').notNull(),revision:integer('revision').notNull().default(0),updatedAt:text('updated_at').notNull()});
export const attachments=sqliteTable('attachments',{id:text('id').primaryKey(),owner:text('owner').notNull(),name:text('name').notNull(),mime:text('mime').notNull(),size:integer('size').notNull(),objectKey:text('object_key').notNull(),createdAt:text('created_at').notNull()});
