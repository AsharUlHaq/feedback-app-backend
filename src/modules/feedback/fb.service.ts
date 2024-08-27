import prisma from "../../utils/db.util";
import { Prisma } from "@prisma/client";
import * as XLSX from "xlsx";
import { createObjectCsvWriter } from "csv-writer";
import axios from "axios";
import { sendAcknowledgementEmail } from "../mailer/mailer.service";

// Get all feedbacks with their IDs and feedback property only
export async function getAllFeedbacksWithIds() {
  const feedbacks = await prisma.feedback.findMany({
    select: {
      id: true,
      feedback: true,
    },
  });
  return feedbacks;
}

// Get feedback property by ID
export async function getFeedbackPropertyById(id: number) {
  const feedback = await prisma.feedback.findUnique({
    where: { id },
    select: {
      id: true,
      feedback: true,
    },
  });
  return feedback;
}

// Find feedback by ID
export async function findFeedbackById(id: number) {
  try {
    const feedback = await prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new Error(`Feedback with id:${id} does not exist`);
    return feedback;
  } catch (error: any) {
    if (error.code === "P2025") {
      // Record not found
      throw new Error("Record not found");
    }
    throw error;
  }
}

// Get all feedback
export async function getAllFeedback() {
  const feedbacks = await prisma.feedback.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      country: true,
      title: true,
      feedback: true,
      modelUsed: true,
      fynderSource: true,
      createdAt: true,
    },
  });
  return feedbacks;
}

// Create new feedback
export async function createFeedback(
  data: Prisma.FeedbackUncheckedCreateInput
) {
  const feedback = await prisma.feedback.create({
    data,
  });
  return feedback;
}

// Update existing feedback
export async function updateFeedback(
  id: number,
  data: Prisma.FeedbackUncheckedUpdateInput
) {
  const existingFeedback = await findFeedbackById(id);
  if (!existingFeedback) throw new Error("Feedback not found");
  const updatedFeedback = await prisma.feedback.update({
    where: { id },
    data,
  });
  return updatedFeedback;
}

// Delete feedback
export async function deleteFeedback(id: number) {
  const existingFeedback = await findFeedbackById(id);
  if (!existingFeedback) throw new Error("Feedback not found");
  await prisma.feedback.delete({
    where: { id },
  });
}

// Export feedback data to Excel
export async function exportFeedbackToExcel() {
  const feedbacks = await prisma.feedback.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      country: true,
      title: true,
      feedback: true,
      modelUsed: true,
      fynderSource: true,
      createdAt: true,
    },
  });

  const worksheet = XLSX.utils.json_to_sheet(feedbacks);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Feedbacks");

  const filePath = "./exports/feedbacks.xlsx";
  XLSX.writeFile(workbook, filePath);

  return filePath;
}

// Export feedback data to CSV
export async function exportFeedbackToCSV() {
  const feedbacks = await prisma.feedback.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      country: true,
      title: true,
      feedback: true,
      modelUsed: true,
      fynderSource: true,
      createdAt: true,
    },
  });

  const csvWriter = createObjectCsvWriter({
    path: "./exports/feedbacks.csv",
    header: [
      { id: "id", title: "ID" },
      { id: "fullName", title: "Full Name" },
      { id: "email", title: "Email" },
      { id: "country", title: "Country" },
      { id: "title", title: "Title" },
      { id: "feedback", title: "Feedback" },
      { id: "modelUsed", title: "Model Used" },
      { id: "fynderSource", title: "Fynder Source" },
      { id: "createdAt", title: "Created At" },
    ],
  });

  await csvWriter.writeRecords(feedbacks);

  return "./exports/feedbacks.csv";
}

// Service to create feedback and save analysis
export const createFeedbackWithAnalysis = async (
  data: Prisma.FeedbackUncheckedCreateInput
) => {
  try {
    // Step 1: Save feedback to the database
    const feedback = await prisma.feedback.create({
      data,
    });

    // Step 2: Send feedback to AI server for sentiment analysis
    const response = await axios.post(
      "http://192.168.100.135:5000/analyze-sentiment",
      {
        feedback: data.feedback,
      }
    );

    // Log the full response to inspect its structure
    console.log("API Response:", response.data);

    // Extract sentiment analysis from the response
    const analysis = response.data.Analysis;

    // Validate the analysis string
    if (!analysis) {
      throw new Error("Sentiment analysis result is missing");
    }

    // Step 3: Save the analysis to the database
    await prisma.analysis.create({
      data: {
        feedbackId: feedback.id,
        analysis,
      },
    });

    // Step 4: Send acknowledgement email to the user
    await sendAcknowledgementEmail(data.email, data.fullName);

    // Return the saved feedback along with its analysis
    const feedbackWithAnalysis = await prisma.feedback.findUnique({
      where: { id: feedback.id },
      include: { Analysis: true },
    });

    return feedbackWithAnalysis;
  } catch (error: any) {
    console.error("Error analyzing and saving feedback:", error);

    // Enhanced error logging
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    throw new Error("Failed to analyze and save feedback");
  }
};
