import React from "react";
import type { Question } from "@/types/quiz";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  question: Question;
  selectedAnswers: number[];
  onAnswerSelect: (questionId: number, answerIndex: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswers,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="text-lg font-semibold text-blue-600">
          Question {questionNumber} of {totalQuestions}
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {question.category}
        </Badge>
      </CardHeader>

      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-4 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers.includes(index);
            const isMultiple = question.type === "multiple";

            return (
              <label
                key={index}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? "bg-green-50 border-green-500 shadow-md"
                    : "bg-gray-50 border-gray-200 hover:border-blue-300"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  onAnswerSelect(question.id, index);
                }}
              >
                <input
                  type={isMultiple ? "checkbox" : "radio"}
                  name={`question-${question.id}`}
                  checked={isSelected}
                  onChange={() => {}} // Handled by onClick
                  className="hidden" // Hide default input
                />
                <span className="text-2xl mr-4 min-w-[30px] text-center">
                  {isMultiple
                    ? isSelected
                      ? "☑"
                      : "☐"
                    : isSelected
                    ? "●"
                    : "○"}
                </span>
                <span className="text-lg text-gray-800 flex-1 leading-relaxed">
                  {option}
                </span>
              </label>
            );
          })}
        </div>

        <div className="text-center text-sm text-gray-600 italic">
          {question.type === "multiple"
            ? "Select all that apply"
            : "Select one answer"}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
