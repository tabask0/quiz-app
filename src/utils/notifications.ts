import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG } from "../config/emailjs";

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// Email spam protection
const EMAIL_COOLDOWN = 30000; // 30 seconds between emails
const MAX_EMAILS_PER_HOUR = 2; // Maximum emails per hour
const MIN_QUIZ_TIME = 10000; // Minimum 10 seconds before termination emails allowed
const HOUR_IN_MS = 60 * 60 * 1000; // 1 hour in milliseconds

interface EmailRecord {
  timestamp: number;
  type: "completion" | "termination";
}

interface EmailSession {
  lastEmailTime: number;
  sessionStart: number;
  emailsSent: string[]; // Track what types of emails were sent in current session
}

let emailSession: EmailSession = {
  lastEmailTime: 0,
  sessionStart: Date.now(),
  emailsSent: [],
};

// Get email history from localStorage
function getEmailHistory(): EmailRecord[] {
  try {
    const stored = localStorage.getItem("networking-quiz-email-history");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Failed to load email history:", error);
    return [];
  }
}

// Save email history to localStorage
function saveEmailHistory(history: EmailRecord[]): void {
  try {
    localStorage.setItem(
      "networking-quiz-email-history",
      JSON.stringify(history)
    );
  } catch (error) {
    console.warn("Failed to save email history:", error);
  }
}

// Clean old email records (older than 1 hour)
function cleanOldEmailRecords(): EmailRecord[] {
  const now = Date.now();
  const history = getEmailHistory();
  const recentHistory = history.filter(
    (record) => now - record.timestamp < HOUR_IN_MS
  );

  if (recentHistory.length !== history.length) {
    saveEmailHistory(recentHistory);
  }

  return recentHistory;
}

// Spam protection functions
function canSendEmail(type: "completion" | "termination"): {
  allowed: boolean;
  reason?: string;
} {
  const now = Date.now();
  const timeSinceLastEmail = now - emailSession.lastEmailTime;
  const timeSinceSessionStart = now - emailSession.sessionStart;

  // Clean old records and get recent email history
  const recentEmails = cleanOldEmailRecords();

  // Check hourly limit
  if (recentEmails.length >= MAX_EMAILS_PER_HOUR) {
    const oldestEmail = Math.min(...recentEmails.map((e) => e.timestamp));
    const timeUntilOldestExpires = HOUR_IN_MS - (now - oldestEmail);
    return {
      allowed: false,
      reason: `Hourly email limit exceeded (${MAX_EMAILS_PER_HOUR} emails per hour). Try again in ${Math.ceil(
        timeUntilOldestExpires / 60000
      )} minutes.`,
    };
  }

  // Check cooldown period
  if (timeSinceLastEmail < EMAIL_COOLDOWN) {
    return {
      allowed: false,
      reason: `Email cooldown active (${Math.ceil(
        (EMAIL_COOLDOWN - timeSinceLastEmail) / 1000
      )}s remaining)`,
    };
  }

  // For termination emails, check minimum quiz time
  if (type === "termination" && timeSinceSessionStart < MIN_QUIZ_TIME) {
    return {
      allowed: false,
      reason: `Minimum quiz time not reached (${Math.ceil(
        (MIN_QUIZ_TIME - timeSinceSessionStart) / 1000
      )}s remaining)`,
    };
  }

  // Check if we already sent this type of email in current session
  if (emailSession.emailsSent.includes(type)) {
    return {
      allowed: false,
      reason: `${type} email already sent this session`,
    };
  }

  return { allowed: true };
}

function recordEmailSent(type: "completion" | "termination"): void {
  const now = Date.now();
  emailSession.lastEmailTime = now;
  emailSession.emailsSent.push(type);

  // Also record in persistent localStorage history
  const history = getEmailHistory();
  history.push({ timestamp: now, type });
  saveEmailHistory(history);
}

// Reset session (call this when starting a new quiz)
export function resetEmailSession(): void {
  emailSession = {
    lastEmailTime: 0,
    sessionStart: Date.now(),
    emailsSent: [],
  };
}

// Clear all email history (call this when you want to reset all limits)
export function clearEmailHistory(): void {
  try {
    localStorage.removeItem("networking-quiz-email-history");
    console.log("Email history cleared");
  } catch (error) {
    console.warn("Failed to clear email history:", error);
  }
}

// Get current email status for debugging
export function getEmailStatus(): {
  recentEmails: EmailRecord[];
  canSendCompletion: boolean;
  canSendTermination: boolean;
  timeUntilNextEmail: number;
} {
  const recentEmails = cleanOldEmailRecords();
  const completionCheck = canSendEmail("completion");
  const terminationCheck = canSendEmail("termination");
  const timeSinceLastEmail = Date.now() - emailSession.lastEmailTime;
  const timeUntilNextEmail = Math.max(0, EMAIL_COOLDOWN - timeSinceLastEmail);

  return {
    recentEmails,
    canSendCompletion: completionCheck.allowed,
    canSendTermination: terminationCheck.allowed,
    timeUntilNextEmail,
  };
}

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
    // Check spam protection
    const spamCheck = canSendEmail(data.type);
    if (!spamCheck.allowed) {
      console.warn(`Email blocked by spam protection: ${spamCheck.reason}`);
      console.log("Current email status:", getEmailStatus());
      return false;
    }

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

    // Record that we sent this email
    recordEmailSent(data.type);
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
