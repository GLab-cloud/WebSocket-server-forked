import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
//Define the 'demo_User' Table
export const demoUsers = pgTable("demo_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp(created_at).defaultNow().notNull(),
});
