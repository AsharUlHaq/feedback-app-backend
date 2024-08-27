import { Request, Response } from "express";
import { getFeedbackWithAnalysis } from "./general.service";

export const getFeedbackWithAnalysisController = async (
  req: Request,
  res: Response
) => {
  try {
    const feedbacksWithAnalysis = await getFeedbackWithAnalysis();
    return res.status(200).json({
      status: 200,
      message: "success",
      data: feedbacksWithAnalysis,
      success: true,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: 400,
      message: "Failed to fetch feedback with analysis",
      data: null,
      success: false,
    });
  }
};
