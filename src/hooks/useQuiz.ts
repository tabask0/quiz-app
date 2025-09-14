import { useState, useCallback, useEffect } from "react";
import type { Question, QuizState, QuizResult } from "@/types/quiz";
import { deobfuscateAnswers } from "../data/questions";
import { calculateCodeScore } from "../utils/codeScoring";
import {
  sendQuizCompletionEmail,
  getCurrentTimestamp,
} from "../utils/notifications";

export const useQuiz = (questions: Question[]) => {
  // Load initial state from localStorage or use default
  const getInitialState = (): QuizState => {
    try {
      const saved = localStorage.getItem("networking-quiz-state");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure the saved state has all required properties
        return {
          currentQuestionIndex: parsed.currentQuestionIndex || 0,
          answers: parsed.answers || {},
          codeAnswers: parsed.codeAnswers || {},
          isCompleted: parsed.isCompleted || false,
          score: parsed.score || 0,
          totalQuestions: questions.length,
        };
      }
    } catch (error) {
      console.warn("Failed to load quiz state from localStorage:", error);
    }

    return {
      currentQuestionIndex: 0,
      answers: {},
      codeAnswers: {},
      isCompleted: false,
      score: 0,
      totalQuestions: questions.length,
    };
  };

  const [quizState, setQuizState] = useState<QuizState>(getInitialState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("networking-quiz-state", JSON.stringify(quizState));
    } catch (error) {
      console.warn("Failed to save quiz state to localStorage:", error);
    }
  }, [quizState]);

  const currentQuestion = questions[quizState.currentQuestionIndex];

  const selectAnswer = useCallback(
    (questionId: number, answerIndex: number) => {
      setQuizState((prev) => {
        const currentAnswers = prev.answers[questionId] || [];
        const question = questions.find((q) => q.id === questionId);

        if (!question) return prev;

        let newAnswers: number[];

        if (question.type === "single") {
          // Single select - replace current answer
          newAnswers = [answerIndex];
        } else {
          // Multiple select - toggle answer
          if (currentAnswers.includes(answerIndex)) {
            newAnswers = currentAnswers.filter((a) => a !== answerIndex);
          } else {
            newAnswers = [...currentAnswers, answerIndex];
          }
        }

        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: newAnswers,
          },
        };
      });
    },
    [questions]
  );

  const updateCodeAnswer = useCallback((questionId: number, code: string) => {
    setQuizState((prev) => ({
      ...prev,
      codeAnswers: {
        ...prev.codeAnswers,
        [questionId]: code,
      },
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setQuizState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= questions.length) {
        return {
          ...prev,
          isCompleted: true,
        };
      }
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
      };
    });
  }, [questions.length]);

  const previousQuestion = useCallback(() => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1),
    }));
  }, []);

  const calculateScore = useCallback((): QuizResult => {
    let correctCount = 0;
    let totalScore = 0;
    const detailedResults: QuizResult["detailedResults"] = [];

    questions.forEach((question) => {
      if (question.type === "coding") {
        // For coding questions, use advanced scoring
        const userCode = quizState.codeAnswers[question.id] || "";
        const codeScore = calculateCodeScore(
          userCode,
          question.correctCode || ""
        );

        // Consider correct if score meets minimum threshold or is above 60%
        const minScore = question.scoringCriteria?.minScore || 60;
        const isCorrect = codeScore.score >= minScore;

        if (isCorrect) {
          correctCount++;
        }

        // Add partial score to total
        totalScore += codeScore.score;

        detailedResults.push({
          questionId: question.id,
          question: question.question,
          category: question.category,
          type: question.type,
          isCorrect,
          userAnswer: userCode,
          correctAnswer: question.correctCode,
          codeScore: {
            score: codeScore.score,
            feedback: codeScore.feedback,
            matchedKeywords: codeScore.matchedKeywords,
            missingKeywords: codeScore.missingKeywords,
          },
        });
      } else {
        // For multiple choice questions
        const userAnswers = quizState.answers[question.id] || [];
        const correctAnswers = deobfuscateAnswers(
          question.correctAnswers || []
        );

        // Check if answers match exactly (order doesn't matter for multiple choice)
        const isCorrect =
          userAnswers.length === correctAnswers.length &&
          userAnswers.every((answer) => correctAnswers.includes(answer));

        if (isCorrect) {
          correctCount++;
        }

        // Add full score for correct multiple choice answers
        totalScore += isCorrect ? 100 : 0;

        // Get option text for display
        const userAnswerText = userAnswers
          .map((idx) => question.options?.[idx] || `Option ${idx + 1}`)
          .join(", ");
        const correctAnswerText = correctAnswers
          .map((idx) => question.options?.[idx] || `Option ${idx + 1}`)
          .join(", ");

        detailedResults.push({
          questionId: question.id,
          question: question.question,
          category: question.category,
          type: question.type,
          isCorrect,
          userAnswer: userAnswerText,
          correctAnswer: correctAnswerText,
        });
      }
    });

    const averageScore = Math.round(totalScore / questions.length);

    return {
      score: correctCount,
      totalQuestions: questions.length,
      percentage: averageScore, // Use average score for more accurate representation
      correctAnswers: correctCount,
      incorrectAnswers: questions.length - correctCount,
      detailedResults,
    };
  }, [questions, quizState.answers, quizState.codeAnswers]);

  const completeQuiz = useCallback(async () => {
    setQuizState((prev) => ({
      ...prev,
      isCompleted: true,
    }));

    // Send completion email notification
    const results = calculateScore();
    try {
      await sendQuizCompletionEmail({
        candidateName: "Candidate", // You can add a name input field later
        candidateEmail: "candidate@example.com", // You can add an email input field later
        score: results.score,
        totalQuestions: results.totalQuestions,
        percentage: results.percentage,
        correctAnswers: results.correctAnswers,
        incorrectAnswers: results.incorrectAnswers,
        completionTime: getCurrentTimestamp(),
        detailedResults: results.detailedResults,
      });
    } catch (error) {
      console.error("Failed to send completion notification:", error);
    }
  }, [calculateScore]);

  const resetQuiz = useCallback(() => {
    // Clear localStorage
    try {
      localStorage.removeItem("networking-quiz-state");
    } catch (error) {
      console.warn("Failed to clear quiz state from localStorage:", error);
    }

    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      codeAnswers: {},
      isCompleted: false,
      score: 0,
      totalQuestions: questions.length,
    });
  }, [questions.length]);

  return {
    quizState,
    currentQuestion,
    selectAnswer,
    updateCodeAnswer,
    nextQuestion,
    previousQuestion,
    calculateScore,
    completeQuiz,
    resetQuiz,
  };
};
