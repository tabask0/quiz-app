import React, { useState } from "react";
import { questions } from "./data/questions";
import { useQuiz } from "./hooks/useQuiz";
import QuestionCard from "./components/QuestionCard";
import CodeEditor from "./components/CodeEditor";
import QuizNavigation from "./components/QuizNavigation";
import QuizResults from "./components/QuizResults";
import AntiInspection from "./components/AntiInspection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const {
    quizState,
    currentQuestion,
    selectAnswer,
    updateCodeAnswer,
    nextQuestion,
    previousQuestion,
    calculateScore,
    completeQuiz,
    resetQuiz,
  } = useQuiz(questions);

  // Check for saved progress on component mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("networking-quiz-state");
      if (saved) {
        const parsed = JSON.parse(saved);
        setHasSavedProgress(
          !parsed.isCompleted &&
            (Object.keys(parsed.answers || {}).length > 0 ||
              Object.keys(parsed.codeAnswers || {}).length > 0)
        );
      }
    } catch (error) {
      console.warn("Failed to check saved progress:", error);
    }
  }, []);

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
  };

  const handleFinishQuiz = () => {
    completeQuiz();
    const results = calculateScore();
    // Store results in state or send to server
    console.log("Quiz Results:", results);
  };

  const handleRestartQuiz = () => {
    resetQuiz();
    setIsQuizStarted(false);
  };

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 flex items-center justify-center p-5">
        <AntiInspection />
        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center space-y-6">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🌐 Networking Interview Assessment
            </CardTitle>
            <p className="text-lg text-gray-600 leading-relaxed">
              Test your networking knowledge with this comprehensive quiz
              covering OSI model, protocols, IP addressing, routing, coding
              challenges, and more.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 text-center">
                <div className="text-sm text-gray-600 mb-2">Questions</div>
                <div className="text-2xl font-bold text-gray-900">
                  {questions.length}
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 text-center">
                <div className="text-sm text-gray-600 mb-2">Time Limit</div>
                <div className="text-2xl font-bold text-gray-900">No limit</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 text-center">
                <div className="text-sm text-gray-600 mb-2">Format</div>
                <div className="text-2xl font-bold text-gray-900">
                  MC + Coding
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {hasSavedProgress && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-blue-800 font-medium">
                    💾 You have saved progress! You can continue where you left
                    off.
                  </p>
                </div>
              )}
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={handleStartQuiz}
              >
                {hasSavedProgress ? "Continue Assessment" : "Start Assessment"}
              </button>
            </div>
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-800 font-medium">
                  🔒 This is a secure assessment environment. Developer tools
                  are disabled.
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800 font-medium">
                  ⚠️ <strong>Important:</strong> Do not use Alt+Tab to switch
                  tabs or minimize the browser during the test. The assessment
                  will be terminated immediately if you do so.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizState.isCompleted) {
    const results = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 flex items-center justify-center p-5">
        <AntiInspection />
        <QuizResults results={results} onRestart={handleRestartQuiz} />
      </div>
    );
  }

  const selectedAnswers = quizState.answers[currentQuestion?.id] || [];
  const codeAnswer = quizState.codeAnswers[currentQuestion?.id] || "";
  const hasAnswer =
    currentQuestion?.type === "coding"
      ? codeAnswer.trim().length > 0
      : selectedAnswers.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 flex items-center justify-center p-5">
      <AntiInspection />
      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        {currentQuestion?.type === "coding" ? (
          <CodeEditor
            question={currentQuestion}
            value={codeAnswer}
            onChange={(code) => updateCodeAnswer(currentQuestion.id, code)}
            questionNumber={quizState.currentQuestionIndex + 1}
            totalQuestions={quizState.totalQuestions}
          />
        ) : (
          <QuestionCard
            question={currentQuestion!}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={selectAnswer}
            questionNumber={quizState.currentQuestionIndex + 1}
            totalQuestions={quizState.totalQuestions}
          />
        )}
        <QuizNavigation
          currentQuestion={quizState.currentQuestionIndex}
          totalQuestions={quizState.totalQuestions}
          onPrevious={previousQuestion}
          onNext={nextQuestion}
          onFinish={handleFinishQuiz}
          canGoNext={hasAnswer}
          canGoPrevious={quizState.currentQuestionIndex > 0}
        />
      </div>
    </div>
  );
}

export default App;
