// src/feedback/feedback.schema.ts

import { z } from "zod";

// Schema for creating new feedback
export const CreateFeedbackSchema = z.object({
  fullName: z.string().min(3).max(30),
  email: z.string().email().max(50),
  country: z.string().min(3).max(30),
  title: z.string().min(5).max(50),
  feedback: z.string().min(5).max(500),
  modelUsed: z.enum(["DEFAULT", "DEEP_SEARCH", "ADVANCED_DEEP_SEARCH"]),
  fynderSource: z.enum([
    "FACEBOOK",
    "INSTAGRAM",
    "LINKEDIN",
    "FRIENDS",
    "COLLEAGUES",
    "OTHER",
  ]),
});

export type CreateFeedbackInput = z.infer<typeof CreateFeedbackSchema>;
