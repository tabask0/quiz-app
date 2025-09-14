import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG } from "../config/emailjs";

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

export interface NotificationData {
  candidateName?: string;
  candidateEmail?: string;
  type: "completion" | "termination";
  score?: number;
  totalQuestions: number;
  percentage?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  completionTime?: string;
  terminationReason?: string;
  terminationTime?: string;
  questionsAnswered?: number;
  partialScore?: number;
  detailedResults?: Array<{
    questionId: number;
    question: string;
    category: string;
    type: string;
    isCorrect: boolean;
    userAnswer?: string;
    correctAnswer?: string;
    codeScore?: {
      score: number;
      feedback: string;
      matchedKeywords: string[];
      missingKeywords: string[];
    };
  }>;
}

/**
 * Send unified email notification for quiz completion or termination
 */
export async function sendNotificationEmail(
  data: NotificationData
): Promise<boolean> {
  try {
    const isCompletion = data.type === "completion";
    const candidateName = data.candidateName || "Unknown Candidate";

    const templateParams = {
      to_email: EMAILJS_CONFIG.RECIPIENT_EMAIL,
      candidate_name: candidateName,
      candidate_email: data.candidateEmail || "Not provided",
      notification_type: isCompletion ? "completion" : "termination",
      score: data.score || 0,
      total_questions: data.totalQuestions,
      percentage: data.percentage || 0,
      correct_answers: data.correctAnswers || 0,
      incorrect_answers: data.incorrectAnswers || 0,
      completion_time: data.completionTime || "",
      termination_reason: data.terminationReason || "",
      termination_time: data.terminationTime || "",
      questions_answered: data.questionsAnswered || 0,
      partial_score: data.partialScore || 0,
      detailed_results: formatDetailedResults(data.detailedResults || []),
      message: isCompletion
        ? `Quiz completed by ${candidateName}. Score: ${data.percentage}% (${data.score}/${data.totalQuestions})`
        : `Quiz terminated for ${candidateName}. Reason: ${data.terminationReason}`,
    };

    const templateId = isCompletion
      ? EMAILJS_CONFIG.COMPLETION_TEMPLATE_ID
      : EMAILJS_CONFIG.TERMINATION_TEMPLATE_ID;

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      templateId,
      templateParams
    );

    console.log(
      `${
        isCompletion ? "Quiz completion" : "Termination"
      } email sent successfully:`,
      response
    );
    return true;
  } catch (error) {
    console.error(`Failed to send ${data.type} email:`, error);
    return false;
  }
}

// Legacy functions for backward compatibility
export async function sendQuizCompletionEmail(
  data: Omit<NotificationData, "type">
): Promise<boolean> {
  return sendNotificationEmail({
    ...data,
    type: "completion",
  });
}

export async function sendTerminationEmail(
  data: Omit<NotificationData, "type">
): Promise<boolean> {
  return sendNotificationEmail({
    ...data,
    type: "termination",
  });
}

/**
 * Format detailed results for email
 */
function formatDetailedResults(
  results: NotificationData["detailedResults"]
): string {
  if (!results || results.length === 0) {
    return "No detailed results available.";
  }

  return results
    .map((result, index) => {
      let resultText = `\n${index + 1}. ${result.question}\n`;
      resultText += `   Category: ${result.category}\n`;
      resultText += `   Type: ${result.type}\n`;
      resultText += `   Status: ${
        result.isCorrect ? "✓ Correct" : "✗ Incorrect"
      }\n`;

      if (result.type === "coding" && result.codeScore) {
        resultText += `   Code Score: ${result.codeScore.score}%\n`;
        resultText += `   Feedback: ${result.codeScore.feedback}\n`;
        if (result.codeScore.matchedKeywords.length > 0) {
          resultText += `   Matched Keywords: ${result.codeScore.matchedKeywords.join(
            ", "
          )}\n`;
        }
        if (result.codeScore.missingKeywords.length > 0) {
          resultText += `   Missing Keywords: ${result.codeScore.missingKeywords.join(
            ", "
          )}\n`;
        }
      } else {
        resultText += `   User Answer: ${result.userAnswer || "No answer"}\n`;
        resultText += `   Correct Answer: ${result.correctAnswer || "N/A"}\n`;
      }

      return resultText;
    })
    .join("\n");
}

/**
 * Get current timestamp
 */
export function getCurrentTimestamp(): string {
  return new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}
