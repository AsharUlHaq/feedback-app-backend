import { Request, Response } from "express";
import { analyzeFeedback, getSentimentCounts } from "./sentiment.service";
import prisma from "../../../utils/db.util";

export const analyzeFeedbackController = async (
  req: Request,
  res: Response
) => {
  const { feedbackId, feedbackText } = req.body;

  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
    });
    if (!feedback) {
      return res.status(404).json({
        status: 404,
        message: `Feedback with ID ${feedbackId} not found`,
        success: false,
      });
    }

    const analysis = await analyzeFeedback(feedbackId, feedbackText);

    res.status(200).json({
      status: 200,
      message: "Sentiment analysis completed and saved",
      data: analysis,
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "An error occurred while analyzing the feedback",
      success: false,
    });
  }
};

export const getSentimentCountsController = async (
  req: Request,
  res: Response
) => {
  try {
    const sentimentCounts = await getSentimentCounts();

    res.status(200).json({
      status: 200,
      message: "Sentiment counts retrieved successfully",
      data: sentimentCounts,
      success: true,
    });
  } catch (error: any) {
    console.error("Error in getSentimentCountsController:", error.message);
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve sentiment counts",
      data: null,
      success: false,
    });
  }
};
