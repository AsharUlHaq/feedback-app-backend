import { Router } from "express";
import {
  analyzeFeedbackController,
  getSentimentCountsController,
} from "./sentiment.controller";

const sentimentalAnalysis = Router();

// Define the route for analyzing feedback
sentimentalAnalysis.post("/analyze-sentiment", analyzeFeedbackController);
sentimentalAnalysis.get("/sentiment-counts", getSentimentCountsController);

export { sentimentalAnalysis };
