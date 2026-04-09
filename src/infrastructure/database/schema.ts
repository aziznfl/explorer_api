import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { pgTable, uuid, text, timestamp, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const itemTypeEnum = pgEnum('item_type', ['folder', 'file']);

export const fileSystemItems = pgTable('file_system_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: itemTypeEnum('type').notNull(),
  extension: text('extension'),
  parentId: uuid('parent_id').references((): AnyPgColumn => fileSystemItems.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => ({
  parentIdIdx: index('parent_id_idx').on(table.parentId),
  nameIdx: index('name_idx').on(table.name),

  uniqueNameType: uniqueIndex('unique_name_type_idx').on(
    table.name,
    table.type
  ),
}));