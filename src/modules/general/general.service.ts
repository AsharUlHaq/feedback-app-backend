import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getFeedbackWithAnalysis = async () => {
  try {
    const feedbacksWithAnalysis = await prisma.feedback.findMany({
      select: {
        country: true,
        feedback: true,
        modelUsed: true,
        createdAt: true,
        Analysis: {
          select: {
            analysis: true,
          },
        },
      },
    });

    return feedbacksWithAnalysis;
  } catch (error: any) {
    console.error("Error fetching feedback with analysis:", error);
    throw new Error("Failed to fetch feedback with analysis");
  }
};
