import { Router } from "express";
import { getFeedbackSummaryController } from "./summary.controller";

const summaryRoutes = Router();

summaryRoutes.get("/feedback-summary", getFeedbackSummaryController);

export { summaryRoutes };
