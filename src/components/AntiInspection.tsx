import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  sendTerminationEmail,
  getCurrentTimestamp,
  getEmailStatus,
} from "../utils/notifications";

// Import email limit constant
const MAX_EMAILS_PER_HOUR = 2;

const AntiInspection: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [failureReason, setFailureReason] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    recentEmails: Array<{ timestamp: number; type: string }>;
    canSendCompletion: boolean;
    canSendTermination: boolean;
    timeUntilNextEmail: number;
  } | null>(null);
  const terminationTriggered = useRef(false);

  // Function to handle termination and send notification
  const handleTermination = useCallback(
    async (reason: string) => {
      // Prevent multiple terminations using ref for immediate check
      if (terminationTriggered.current || showFailure || emailSent) {
        return;
      }

      // Additional protection: Check if quiz has been running for at least 10 seconds
      const quizStartTime = localStorage.getItem("networking-quiz-start-time");
      if (quizStartTime) {
        const timeSinceStart = Date.now() - parseInt(quizStartTime);
        if (timeSinceStart < 10000) {
          // 10 seconds minimum
          console.warn("Termination blocked: Quiz not running long enough");
          return;
        }
      }

      // Mark as triggered immediately
      terminationTriggered.current = true;
      setFailureReason(reason);
      setShowFailure(true);
      setEmailSent(true);
      localStorage.clear();

      // Send termination email notification
      try {
        // Get current progress from localStorage before clearing
        const savedState = localStorage.getItem("networking-quiz-state");
        let questionsAnswered = 0;
        let partialScore = 0;

        if (savedState) {
          try {
            const parsed = JSON.parse(savedState);
            questionsAnswered =
              Object.keys(parsed.answers || {}).length +
              Object.keys(parsed.codeAnswers || {}).length;
            // Calculate partial score if possible
            partialScore =
              questionsAnswered > 0
                ? Math.round((questionsAnswered / 40) * 100)
                : 0;
          } catch (error) {
            console.warn(
              "Failed to parse saved state for termination notification:",
              error
            );
          }
        }

        await sendTerminationEmail({
          candidateName: "Candidate", // You can add a name input field later
          candidateEmail: "candidate@example.com", // You can add an email input field later
          terminationReason: reason,
          terminationTime: getCurrentTimestamp(),
          questionsAnswered,
          totalQuestions: 40,
          partialScore,
        });
      } catch (error) {
        console.error("Failed to send termination notification:", error);
      }
    },
    [showFailure, emailSent]
  );

  // Check email status periodically
  useEffect(() => {
    const checkEmailStatus = () => {
      const status = getEmailStatus();
      setEmailStatus(status);
    };

    checkEmailStatus();
    const interval = setInterval(checkEmailStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return false;
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        return false;
      }

      // Ctrl+S (Save)
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C (Element Inspector)
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Detect page refresh/reload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show warning if quiz is actually started
      const quizStartTime = localStorage.getItem("networking-quiz-start-time");
      if (quizStartTime) {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? Your progress will be lost.";
        return "Are you sure you want to leave? Your progress will be lost.";
      }
    };

    // Single tab switching detection - only use visibility change
    const handleVisibilityChange = () => {
      if (document.hidden && !terminationTriggered.current) {
        handleTermination(
          "You switched to another tab (Alt+Tab) or minimized the browser during the assessment."
        );
      }
    };

    // Focus handler to reset state when returning to page
    const handleFocus = () => {
      // This helps prevent false positives from legitimate interactions
      // No termination logic here - only visibility change triggers termination
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Disable DevTools detection
    let devtools = false;
    const threshold = 160;

    const checkDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools) {
          devtools = true;
          setShowWarning(true);
        }
      } else {
        if (devtools) {
          devtools = false;
          setShowWarning(false);
        }
      }
    };

    const interval = setInterval(checkDevTools, 500);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(interval);

      // Reset termination trigger on cleanup
      terminationTriggered.current = false;
    };
  }, [handleTermination]);

  if (showFailure) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/95 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-lg mx-4 text-center shadow-2xl border-4 border-red-500">
          <div className="text-8xl mb-6">🚫</div>
          <h1 className="text-3xl font-bold text-red-600 mb-6">
            Assessment Terminated
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium text-lg mb-2">
              Reason for Termination:
            </p>
            <p className="text-red-700">{failureReason}</p>
          </div>
          <div className="space-y-4">
            <p className="text-gray-700 text-lg">
              The assessment has been terminated due to a security violation.
            </p>
            <p className="text-gray-600">
              All progress has been cleared and you cannot return to the test.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mt-6">
              <p className="text-gray-600 text-sm">
                <strong>Note:</strong> This is a secure assessment environment.
                Any attempt to switch tabs, minimize the browser, or access
                external resources will result in immediate termination.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show email limit warning if approaching limit
  if (
    emailStatus &&
    emailStatus.recentEmails &&
    emailStatus.recentEmails.length >= 1
  ) {
    return (
      <div className="fixed top-4 right-4 z-40 bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-sm shadow-lg">
        <div className="flex items-center">
          <div className="text-2xl mr-3">📧</div>
          <div>
            <h3 className="font-semibold text-yellow-800">
              Email Limit Warning
            </h3>
            <p className="text-sm text-yellow-700">
              {emailStatus.recentEmails.length}/{MAX_EMAILS_PER_HOUR} emails
              sent this hour
            </p>
            {emailStatus.timeUntilNextEmail > 0 && (
              <p className="text-xs text-yellow-600">
                Next email allowed in{" "}
                {Math.ceil(emailStatus.timeUntilNextEmail / 1000)}s
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showWarning) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Developer Tools Detected
          </h1>
          <p className="text-gray-700 mb-2">
            Please close developer tools to continue with the quiz.
          </p>
          <p className="text-sm text-gray-500">
            This is a secure assessment environment.
          </p>
        </div>
      </div>
    );
  }

  return null; // This component doesn't render anything
};

export default AntiInspection;
