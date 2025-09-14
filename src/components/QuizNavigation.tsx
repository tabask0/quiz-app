import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onFinish,
  canGoNext,
  canGoPrevious,
}) => {
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="flex items-center justify-between gap-6 pt-6 border-t">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="min-w-[120px]"
      >
        ← Previous
      </Button>

      <div className="flex-1 flex flex-col items-center space-y-2">
        <Progress value={progress} className="w-full h-2" />
        <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <span>
            {currentQuestion + 1} / {totalQuestions}
          </span>
          <span className="text-green-600">💾 Auto-saved</span>
        </div>
      </div>

      <Button
        onClick={isLastQuestion ? onFinish : onNext}
        disabled={!canGoNext}
        className="min-w-[120px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        {isLastQuestion ? "Finish Quiz" : "Next →"}
      </Button>
    </div>
  );
};

export default QuizNavigation;
