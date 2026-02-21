DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'match_status') THEN CREATE TYPE "public"."match_status" AS ENUM('scheduled', 'live', 'finished'); END IF; END $$;
CREATE TABLE IF NOT EXISTS "commentary" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer NOT NULL,
	"period" text,
	"event_type" text,
	"actor" text,
	"team" text,
	"minute" integer,
	"sequence" integer,
	"message" text NOT NULL,
	"tags" text[],
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "demo_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "demo_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"sport" text NOT NULL,
	"home_team" text NOT NULL,
	"away_team" text NOT NULL,
	"status" "match_status" DEFAULT 'scheduled' NOT NULL,
	"end_time" timestamp,
	"home_score" integer DEFAULT 0 NOT NULL,
	"away_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commentary_match_id_matches_id_fk') THEN 
        ALTER TABLE "commentary" ADD CONSTRAINT "commentary_match_id_matches_id_fk" 
        FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") 
        ON DELETE no action ON UPDATE no action;
    END IF; 
END $$;