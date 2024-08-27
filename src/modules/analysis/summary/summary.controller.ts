import { Request, Response } from "express";
import { getFeedbackSummary } from "./summary.service";

export const getFeedbackSummaryController = async (
  req: Request,
  res: Response
) => {
  try {
    const summary = await getFeedbackSummary();
    return res
      .status(200)
      .json({ status: 200, message: "success", data: summary, success: true });
  } catch (error: any) {
    console.error("Error in getFeedbackSummaryController:", error.message);
    return res.status(400).json({
      status: 400,
      message: "Failed to get feedback summary",
      data: null,
      success: false,
    });
  }
};
