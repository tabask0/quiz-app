import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CodeEditorProps {
  question: {
    id: number;
    question: string;
    category: string;
    language?: string;
    placeholder?: string;
  };
  value: string;
  onChange: (value: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  question,
  value,
  onChange,
  questionNumber,
  totalQuestions,
}) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="text-lg font-semibold text-blue-600">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {question.category}
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {question.language?.toUpperCase() || "CODE"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
          {question.question}
        </h2>

        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-2 text-sm text-gray-600 font-medium">
                {question.language?.toUpperCase() || "CODE"} Editor
              </span>
            </div>
          </div>

          <div className="h-96">
            <Editor
              height="100%"
              language={question.language || "python"}
              value={value || question.placeholder || ""}
              onChange={(newValue) => onChange(newValue || "")}
              onMount={handleEditorDidMount}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: "on",
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                renderLineHighlight: "line",
                scrollbar: {
                  vertical: "auto",
                  horizontal: "auto",
                },
                padding: { top: 16, bottom: 16 },
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                },
                quickSuggestions: {
                  other: true,
                  comments: false,
                  strings: false,
                },
              }}
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-lg">💡</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Coding Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use proper indentation and formatting</li>
                <li>• Include necessary imports at the top</li>
                <li>• Handle edge cases and errors appropriately</li>
                <li>• Make sure your function returns the expected output</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;
