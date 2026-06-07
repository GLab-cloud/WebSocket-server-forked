import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { matchIdParamSchema } from "../validation/matches.js";
import { createCommentarySchema, listQueryCommentarySchema } from "../validation/commentary.js";
import { commentary } from "../db/schema.js";
import { db } from "../db/db.js";

const MAX_LIMIT = 100;

export const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get("/", async (req, res) => {
  try {
    const paramsParsed = matchIdParamSchema.safeParse(req.params);
    if (!paramsParsed.success) {
      res.status(400).json({
        error: "Invalid match id",
        details: paramsParsed.error.issues,
      });
      return;
    }

    const queryParsed = listQueryCommentarySchema.safeParse(req.query);
    if (!queryParsed.success) {
      res.status(400).json({
        error: "Invalid query",
        details: queryParsed.error.issues,
      });
      return;
    }

    const limit = Math.min(queryParsed.data.limit ?? 100, MAX_LIMIT);

    const data = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, paramsParsed.data.id))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    res.json({ data });
  } catch (e) {
    res.status(500).json({
      error: "Failed to list commentary",
      details: e.message,
    });
  }
});

commentaryRouter.post("/", async (req, res) => {
  try {
    const paramsParsed = matchIdParamSchema.safeParse(req.params);
    if (!paramsParsed.success) {
      res.status(400).json({
        error: "Invalid match id",
        details: paramsParsed.error.issues,
      });
      return;
    }

    const bodyParsed = createCommentarySchema.safeParse(req.body);
    if (!bodyParsed.success) {
      res.status(400).json({
        error: "Invalid payload",
        details: bodyParsed.error.issues,
      });
      return;
    }

    const [entry] = await db
      .insert(commentary)
      .values({
        matchId: paramsParsed.data.id,
        ...bodyParsed.data,
        minute: bodyParsed.data.minute ?? null,
        sequence: bodyParsed.data.sequence ?? null,
        tags: bodyParsed.data.tags ?? null,
        metadata: bodyParsed.data.metadata ?? null,
      })
      .returning();

    res.status(201).json({ data: entry });
  } catch (e) {
    res.status(500).json({
      error: "Failed to create commentary",
      details: e.message,
    });
  }
});
