import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  jsonb,
  integer,
  index,
} from "drizzle-orm/pg-core";

//Define the 'demo_User' Table
export const demoUsers = pgTable("demo_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
]);

export const matches = pgTable(
  "matches",
  {
    id: serial("id").primaryKey(),
    sport: text("sport").notNull(),
    homeTeam: text("home_team").notNull(),
    awayTeam: text("away_team").notNull(),
    startTime: timestamp("start_time").notNull(), // Fixed: Added missing startTime
    endTime: timestamp("end_time").notNull(),
    status: matchStatusEnum("status").notNull().default("scheduled"),
    homeScore: integer("home_score").notNull().default(0),
    awayScore: integer("away_score").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // Performance: Add indexes for frequently queried columns
    statusIdx: index("idx_matches_status").on(table.status),
    createdAtIdx: index("idx_matches_created_at").on(table.createdAt),
    sportIdx: index("idx_matches_sport").on(table.sport),
  })
);

export const commentary = pgTable("commentary", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id")
    .notNull()
    .references(() => matches.id),
  period: text("period"),
  eventType: text("event_type"),
  actor: text("actor"),
  team: text("team"),
  minute: integer("minute"),
  sequence: integer("sequence"),
  message: text("message").notNull(),
  tags: text("tags").array(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
