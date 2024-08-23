import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getFeedbackSummary = async () => {
  try {
    // Fetch all feedbacks from the database
    const feedbacks = await prisma.feedback.findMany({
      select: {
        feedback: true, // Only select the feedback text
        createdAt: true, // To get the last feedback date
      },
    });

    if (feedbacks.length === 0) {
      throw new Error("No feedbacks available");
    }

    // Post all feedbacks to the Flask server for summarization
    const response = await axios.post("http://192.168.100.135:5000/summarize", {
      feedbacks: feedbacks.map((fb) => fb.feedback),
    });

    // Debugging: Log the entire response from the Flask API
    console.log("Flask API Response:", response.data);

    // Access the data returned by the Flask API
    const summaryData = response.data;

    // Check if summaryData exists and has the expected properties
    if (!summaryData || !summaryData.summaryText) {
      throw new Error("Invalid response from the Flask API");
    }

    // const lastFeedbackDate = feedbacks[feedbacks.length - 1].createdAt;

    // Store the summary data in the database
    const savedSummary = await prisma.summary.create({
      data: {
        summaryText: summaryData.summaryText,
        timestamp: new Date(summaryData.Timestamp),
        feedbackCount: summaryData.feedbackCount,
        wordFrequencies: summaryData.WordFrequencies,
      },
    });

    // Return the saved summary data
    return savedSummary;
  } catch (error: any) {
    console.error("Error getting feedback summary:", error);
    throw new Error("Failed to get feedback summary");
  }
};
