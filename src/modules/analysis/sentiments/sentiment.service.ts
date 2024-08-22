import axios from "axios";
import prisma from "../../../utils/db.util";
import { AnalysisType } from "@prisma/client";

export const analyzeFeedback = async (
  feedbackId: number,
  feedbackText: string
) => {
  const response = await axios.post(
    "http://192.168.100.135:5000/analyze-sentiment",
    { text: feedbackText }
  );

  const analysis = response.data.analysis;

  const analysisEntry = await prisma.analysis.create({
    data: {
      feedbackId: feedbackId,
      analysis: analysis,
    },
  });

  return analysisEntry;
};

export const getSentimentCounts = async () => {
  try {
    // Get the count of each sentiment type
    const sentimentCounts = await prisma.analysis.groupBy({
      by: ["analysis"],
      _count: {
        id: true, // Count the number of rows for each sentiment
      },
    });

    // Initialize counts with default values
    const totalCounts: Record<AnalysisType, number> = {
      GOOD: 0,
      VERY_GOOD: 0,
      BAD: 0,
      VERY_BAD: 0,
      NEUTRAL: 0,
    };

    // Populate the counts based on the result
    sentimentCounts.forEach((entry) => {
      totalCounts[entry.analysis as AnalysisType] = entry._count.id;
    });

    return totalCounts;
  } catch (error) {
    console.error("Error getting sentiment counts:", error);
    throw new Error("Failed to retrieve sentiment counts");
  }
};
