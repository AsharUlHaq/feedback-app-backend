import { Router } from "express";
import { getFeedbackWithAnalysisController } from "./general.controller";

const generalRoutes = Router();

generalRoutes.get("/feedbacks-analysis", getFeedbackWithAnalysisController);

export { generalRoutes };
