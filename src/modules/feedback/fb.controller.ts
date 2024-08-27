// src/feedback/feedback.controller.ts

import { Request, Response } from "express";
import * as feedbackService from "./fb.service";
import { CreateFeedbackSchema } from "./fb.schema";
import { ZodError } from "zod";

// Get all feedback properties with their IDs only
export const getAllFeedbacksWithIds = async (req: Request, res: Response) => {
  try {
    const feedbacks = await feedbackService.getAllFeedbacksWithIds();
    res.status(200).json({
      status: 200,
      message: "success",
      data: feedbacks,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve feedbacks",
      data: null,
      success: false,
    });
  }
};

// Get feedback property by ID
export const getFeedbackPropertyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const feedback = await feedbackService.getFeedbackPropertyById(Number(id));
    if (feedback) {
      res.status(200).json({
        status: 200,
        message: "success",
        data: feedback,
        success: true,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: `Feedback with id ${id} not found`,
        data: null,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve feedback",
      success: false,
    });
  }
};

// Get all feedback
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const feedbacks = await feedbackService.getAllFeedback();
    return res.status(200).json({
      status: 200,
      message: "success",
      data: feedbacks,
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const messageJSON = JSON.parse(error.message);
      const message = `${messageJSON[0].path[0]} is ${messageJSON[0].message}`;
      console.error(message);
      return res.status(400).json({
        status: 400,
        message: message,
        data: null,
        success: false,
      });
    }
  }
  {
    return res.status(500).json({
      status: 500,
      message: "Failed to retrieve feedbacks",
      data: null,
      success: false,
    });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const feedback = await feedbackService.findFeedbackById(Number(id));
    if (feedback) {
      res.status(200).json({
        status: 200,
        message: "success",
        data: feedback,
        success: true,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: `Feedback with id ${id} not found`,
        data: null,
        success: false,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve feedback",
      data: null,
      success: false,
    });
  }
};

// Create new feedback
// export const createFeedback = async (req: Request, res: Response) => {
//   try {
//     // Validate input data
//     const validatedData = CreateFeedbackSchema.parse(req.body);
//     const feedback = await feedbackService.createFeedback(validatedData);
//     res
//       .status(200)
//       .json({ status: 200, message: "success", data: feedback, success: true });
//   } catch (error: any) {
//     if (error instanceof ZodError) {
//       const messageJSON = JSON.parse(error.message);
//       const message = `${messageJSON[0].path[0]} is ${messageJSON[0].message}`;
//       console.error(message);
//       return res.status(400).json({
//         status: 400,
//         message: message,
//         data: null,
//         success: false,
//       });
//     }
//     {
//       res.status(400).json({
//         status: 400,
//         message: error.message || "Failed to create feedback",
//         data: null,
//         success: false,
//       });
//     }
//   }
// };

export const createFeedback = async (req: Request, res: Response) => {
  try {
    // Validate input data
    const validatedData = CreateFeedbackSchema.parse(req.body);

    // Analyze and save feedback
    const feedback = await feedbackService.createFeedbackWithAnalysis(
      validatedData
    );

    res
      .status(200)
      .json({ status: 200, message: "success", data: feedback, success: true });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const messageJSON = JSON.parse(error.message);
      const message = `${messageJSON[0].path[0]} is ${messageJSON[0].message}`;
      console.error(message);
      return res.status(400).json({
        status: 400,
        message: message,
        data: null,
        success: false,
      });
    } else {
      console.error("Error in createFeedback:", error.message);
      res.status(400).json({
        status: 400,
        message: "Failed to create feedback with analysis",
        data: null,
        success: false,
      });
    }
  }
};

// // Update existing feedback
// export const updateFeedback = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     // Validate input data
//     const validatedData = UpdateFeedbackSchema.parse(req.body);
//     const updatedFeedback = await feedbackService.updateFeedback(
//       Number(id),
//       validatedData
//     );
//     res.json(updatedFeedback);
//   } catch (error: any) {
//     res
//       .status(400)
//       .json({ error: error.message || "Failed to update feedback" });
//   }
// };

// Delete feedback
export const deleteFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await feedbackService.deleteFeedback(Number(id));
    res
      .status(200)
      .json({ status: 200, message: "success", data: null, success: true })
      .send();
  } catch (error: any) {
    res.status(404).json({
      status: 404,
      message: `Feedback with id ${id} not found`,
      data: null,
      success: false,
    });
  }
};

// Export feedback to Excel
export const exportFeedbackToExcel = async (req: Request, res: Response) => {
  try {
    const filePath = await feedbackService.exportFeedbackToExcel();
    res.download(filePath, "feedbacks.xlsx");
  } catch (error: any) {
    res.status(500).json({ error: "Failed to export feedbacks to Excel" });
  }
};

// Export feedback to CSV
export const exportFeedbackToCSV = async (req: Request, res: Response) => {
  try {
    const filePath = await feedbackService.exportFeedbackToCSV();
    res.download(filePath, "feedbacks.csv");
  } catch (error: any) {
    res.status(500).json({ error: "Failed to export feedbacks to CSV" });
  }
};
