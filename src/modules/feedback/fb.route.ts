// src/feedback/feedback.route.ts

import { Router } from "express";
import * as feedbackController from "./fb.controller";

const feedbackRoutes = Router();

// Define routes
feedbackRoutes.get("/get-all-feedback", feedbackController.getAllFeedback);
feedbackRoutes.get("/get-feedback/:id", feedbackController.getFeedbackById);
feedbackRoutes.post("/create-feedback", feedbackController.createFeedback);
// router.put("/:id", feedbackController.updateFeedback);
feedbackRoutes.delete(
  "/delete-feedback/:id",
  feedbackController.deleteFeedback
);
feedbackRoutes.get("/export/excel", feedbackController.exportFeedbackToExcel);
feedbackRoutes.get("/export/csv", feedbackController.exportFeedbackToCSV);

export { feedbackRoutes };
