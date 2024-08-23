import { Request, Response } from "express";
import { getFeedbackSummary } from "./summary.service";

// export const getFeedbackSummaryController = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const summary = await getFeedbackSummary();
//     res
//       .status(200)
//       .json({ status: 200, message: "success", data: summary, success: true });
//   } catch (error) {
//     console.error("Error in getFeedbackSummaryController:", error);
//     res.status(500).json({
//       status: 500,
//       message: "Failed to get feedback summary",
//       data: null,
//       success: false,
//     });
//   }
// };

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
    return res.status(500).json({
      status: 500,
      message: "Failed to get feedback summary",
      data: null,
      success: false,
    });
  }
};
