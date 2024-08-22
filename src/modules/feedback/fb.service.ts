import prisma from "../../utils/db.util";
import { Prisma } from "@prisma/client";
import * as XLSX from "xlsx";
import { createObjectCsvWriter } from "csv-writer";

// Find feedback by ID
export async function findFeedbackById(id: number) {
  try {
    const feedback = await prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new Error(`Feedback with id:${id} does not exist`);
    return feedback;
  } catch (error: any) {
    if (error.code === "P2025") {
      // Record not found
      return null;
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
