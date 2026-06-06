import { Router } from "express";
import { matchIdParamSchema } from "../validation/matches.js";
import { createCommentarySchema } from "../validation/commentary.js";
import { commentary } from "../db/schema.js";
import { db } from "../db/db.js";

export const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get("/", (req, res) => {
  res.status(200).json({ message: "Commentaty list" });
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
