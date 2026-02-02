"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ProgressDots } from "./ProgressDots";

interface QuestionContainerProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  subtext?: string;
  children: ReactNode;
  error?: string | null;
  direction: "forward" | "backward";
  onPrev?: () => void;
  showPrev?: boolean;
}

export function QuestionContainer({
  questionNumber,
  totalQuestions,
  question,
  subtext,
  children,
  error,
  direction,
  onPrev,
  showPrev = true,
}: QuestionContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the container for keyboard events
    containerRef.current?.focus();
  }, [questionNumber]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#374B46] flex flex-col"
      tabIndex={-1}
    >
      {/* Progress bar at top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-10">
        <div
          className="h-full bg-[#D97757] transition-all duration-500 ease-out"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Back button */}
      {showPrev && onPrev && questionNumber > 1 && (
        <button
          onClick={onPrev}
          className="fixed top-6 left-6 p-2 text-gray-400 hover:text-gray-300 transition-colors z-10"
          aria-label="Previous question"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div
          className={`w-full max-w-2xl transition-all duration-300 ease-out ${
            direction === "forward"
              ? "animate-slide-in-right"
              : "animate-slide-in-left"
          }`}
        >
          {/* Question number */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-400 font-medium">
              {questionNumber}
            </span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>

          {/* Question text */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-3 leading-tight">
            {question}
          </h1>

          {/* Subtext */}
          {subtext && (
            <p className="text-gray-300 text-lg mb-8">{subtext}</p>
          )}

          {/* Input area */}
          <div className="mt-8">{children}</div>

          {/* Error message */}
          {error && (
            <p className="mt-4 text-red-400 text-sm">{error}</p>
          )}
        </div>
      </div>

      {/* Progress dots at bottom */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <ProgressDots
          current={questionNumber}
          total={totalQuestions}
        />
      </div>
    </div>
  );
}
