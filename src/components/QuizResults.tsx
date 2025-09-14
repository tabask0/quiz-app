import React, { useState } from "react";
import type { QuizResult } from "@/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuizResultsProps {
  results: QuizResult;
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ results, onRestart }) => {
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "excellent";
    if (percentage >= 60) return "good";
    if (percentage >= 40) return "fair";
    return "poor";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 80)
      return "Excellent work! You have strong networking knowledge.";
    if (percentage >= 60)
      return "Good job! You have a solid understanding of networking concepts.";
    if (percentage >= 40)
      return "Not bad! Consider reviewing some networking fundamentals.";
    return "Keep studying! Networking concepts need more attention.";
  };

  return (
    <div className="w-full max-w-6xl space-y-6">
      {/* Main Results Card */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center space-y-6">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Quiz Complete!
          </CardTitle>
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto text-4xl font-bold text-white ${
              getScoreColor(results.percentage) === "excellent"
                ? "bg-gradient-to-br from-green-500 to-green-600"
                : getScoreColor(results.percentage) === "good"
                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                : getScoreColor(results.percentage) === "fair"
                ? "bg-gradient-to-br from-orange-500 to-orange-600"
                : "bg-gradient-to-br from-red-500 to-red-600"
            }`}
          >
            {results.percentage}%
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="text-center">
            <p className="text-xl text-gray-600 leading-relaxed">
              {getScoreMessage(results.percentage)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 text-center">
              <div className="text-sm text-gray-600 mb-2">Correct Answers</div>
              <div className="text-3xl font-bold text-green-600">
                {results.correctAnswers}
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 text-center">
              <div className="text-sm text-gray-600 mb-2">
                Incorrect Answers
              </div>
              <div className="text-3xl font-bold text-red-600">
                {results.incorrectAnswers}
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 text-center">
              <div className="text-sm text-gray-600 mb-2">Total Questions</div>
              <div className="text-3xl font-bold text-gray-900">
                {results.totalQuestions}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setShowDetailedResults(!showDetailedResults)}
              variant="outline"
              className="flex-1 py-3 px-6 text-lg font-semibold"
            >
              {showDetailedResults ? "Hide" : "Show"} Detailed Results
            </Button>
            <Button
              onClick={onRestart}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 text-lg font-semibold"
            >
              Take Quiz Again
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      {showDetailedResults && results.detailedResults && (
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 text-center">
              Detailed Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.detailedResults.map((result, index) => (
              <div
                key={result.questionId}
                className={`p-6 rounded-xl border-2 ${
                  result.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        result.isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {result.question}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {result.category}
                        </Badge>
                        <Badge
                          variant={
                            result.type === "coding" ? "default" : "outline"
                          }
                          className="text-xs"
                        >
                          {result.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      result.isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </div>
                </div>

                {result.type === "coding" ? (
                  <div className="space-y-4">
                    {/* Code Score Display */}
                    {result.codeScore && (
                      <div
                        className={`p-4 rounded-lg border-2 ${
                          result.codeScore.score >= 80
                            ? "bg-green-50 border-green-200"
                            : result.codeScore.score >= 60
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">
                            Code Score
                          </h4>
                          <span
                            className={`text-2xl font-bold ${
                              result.codeScore.score >= 80
                                ? "text-green-600"
                                : result.codeScore.score >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.codeScore.score}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          {result.codeScore.feedback}
                        </p>

                        {/* Keywords Analysis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {result.codeScore.matchedKeywords.length > 0 && (
                            <div>
                              <span className="font-medium text-green-700">
                                ✓ Matched Keywords:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.codeScore.matchedKeywords.map(
                                  (keyword, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-green-100 text-green-800 px-2 py-1 rounded"
                                    >
                                      {keyword}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {result.codeScore.missingKeywords.length > 0 && (
                            <div>
                              <span className="font-medium text-red-700">
                                ✗ Missing Keywords:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.codeScore.missingKeywords.map(
                                  (keyword, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-red-100 text-red-800 px-2 py-1 rounded"
                                    >
                                      {keyword}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Your Code:
                        </h4>
                        <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                          {result.userAnswer || "No code submitted"}
                        </pre>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Expected Code:
                        </h4>
                        <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                          {result.correctAnswer || "N/A"}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Your Answer:
                      </h4>
                      <p className="text-sm text-gray-600">
                        {result.userAnswer || "No answer selected"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Correct Answer:
                      </h4>
                      <p className="text-sm text-gray-600">
                        {result.correctAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizResults;
