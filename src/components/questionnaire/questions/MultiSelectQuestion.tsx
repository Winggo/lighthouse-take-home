"use client";

import { useEffect, useCallback } from "react";
import { QuestionOption } from "@/lib/schemas/questionnaire";

interface MultiSelectQuestionProps {
  value: string[];
  onChange: (value: string[]) => void;
  onSubmit: () => void;
  options: QuestionOption[];
}

export function MultiSelectQuestion({
  value,
  onChange,
  onSubmit,
  options,
}: MultiSelectQuestionProps) {
  const toggleOption = useCallback(
    (optionId: string) => {
      // If selecting "none", clear all other selections
      if (optionId === "none") {
        onChange(value.includes("none") ? [] : ["none"]);
        return;
      }

      // If selecting something else, remove "none" if present
      let newValue = value.filter((v) => v !== "none");

      if (newValue.includes(optionId)) {
        newValue = newValue.filter((v) => v !== optionId);
      } else {
        newValue = [...newValue, optionId];
      }

      onChange(newValue);
    },
    [value, onChange]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-9 toggle options
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= options.length) {
        e.preventDefault();
        toggleOption(options[num - 1].id);
      }

      // Enter to submit
      if (e.key === "Enter" && value.length > 0) {
        e.preventDefault();
        onSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, toggleOption, onSubmit, value]);

  return (
    <div>
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = value.includes(option.id);
          const keyLabel = String.fromCharCode(65 + index); // A, B, C, ...

          return (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`
                w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                flex items-center gap-3
                ${
                  isSelected
                    ? "border-[#D97757] bg-[#D97757]"
                    : "border-gray-600 hover:border-[#D97757]"
                }
              `}
            >
              <span
                className={`
                  w-7 h-7 rounded border-2 flex items-center justify-center text-sm font-bold shrink-0
                  ${
                    isSelected
                      ? "border-[#D97757] bg-[#D97757] text-white"
                      : "border-gray-500 text-gray-400"
                  }
                `}
              >
                {isSelected ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  keyLabel
                )}
              </span>
              <span
                className={`text-lg ${isSelected ? "text-white" : "text-gray-300"}`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={onSubmit}
          disabled={value.length === 0}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
            ${
              value.length > 0
                ? "bg-[#D97757] text-white hover:bg-[#C86647]"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          OK
          <span
            className={`text-sm ${value.length > 0 ? "text-gray-300" : "text-gray-600"}`}
          >
            {value.length} selected
          </span>
        </button>
      </div>

      <p className="mt-3 text-gray-400 text-sm">
        Press{" "}
        <span className="font-mono bg-gray-700 px-1 rounded">A</span>-
        <span className="font-mono bg-gray-700 px-1 rounded">
          {String.fromCharCode(64 + options.length)}
        </span>{" "}
        to select, <span className="font-mono bg-gray-700 px-1 rounded">Enter</span>{" "}
        to continue
      </p>
    </div>
  );
}
