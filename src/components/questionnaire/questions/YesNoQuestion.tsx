"use client";

import { useEffect, useRef, KeyboardEvent } from "react";

interface YesNoQuestionProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  onSubmit: () => void;
  followUpValue?: string | null;
  onFollowUpChange?: (value: string) => void;
  followUpPlaceholder?: string;
}

export function YesNoQuestion({
  value,
  onChange,
  onSubmit,
  followUpValue,
  onFollowUpChange,
  followUpPlaceholder,
}: YesNoQuestionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    // Focus textarea when yes is selected
    if (value === true && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [value]);

  // Auto-submit when No is selected (after state update completes)
  // Only submit if value actually changed (not on initial render or re-renders)
  useEffect(() => {
    const valueChanged = prevValueRef.current !== value;
    prevValueRef.current = value;

    if (valueChanged && value === false) {
      const timer = setTimeout(() => onSubmit(), 100);
      return () => clearTimeout(timer);
    }
  }, [value, onSubmit]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "y" || e.key === "Y") {
      e.preventDefault();
      onChange(true);
    } else if (e.key === "n" || e.key === "N") {
      e.preventDefault();
      onChange(false);
    }
  };

  const handleTextareaKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div onKeyDown={value === null ? handleKeyDown : undefined} tabIndex={0}>
      <div className="flex gap-3">
        <button
          onClick={() => onChange(true)}
          className={`
            px-8 py-4 rounded-lg border-2 font-medium text-lg transition-all
            ${
              value === true
                ? "border-[#D97757] bg-[#D97757] text-white"
                : "border-gray-600 text-gray-300 hover:border-[#D97757]"
            }
          `}
        >
          <span className="flex items-center gap-2">
            <span
              className={`
              w-6 h-6 rounded border-2 flex items-center justify-center text-sm font-bold
              ${value === true ? "border-[#D97757] bg-[#D97757] text-white" : "border-gray-500"}
            `}
            >
              Y
            </span>
            Yes
          </span>
        </button>
        <button
          onClick={() => onChange(false)}
          className={`
            px-8 py-4 rounded-lg border-2 font-medium text-lg transition-all
            ${
              value === false
                ? "border-[#D97757] bg-[#D97757] text-white"
                : "border-gray-600 text-gray-300 hover:border-[#D97757]"
            }
          `}
        >
          <span className="flex items-center gap-2">
            <span
              className={`
              w-6 h-6 rounded border-2 flex items-center justify-center text-sm font-bold
              ${value === false ? "border-[#D97757] bg-[#D97757] text-white" : "border-gray-500"}
            `}
            >
              N
            </span>
            No
          </span>
        </button>
      </div>

      {/* Follow-up textarea when Yes is selected */}
      {value === true && onFollowUpChange && (
        <div className="mt-6 animate-fade-in">
          <textarea
            ref={textareaRef}
            value={followUpValue || ""}
            onChange={(e) => onFollowUpChange(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder={followUpPlaceholder}
            rows={3}
            className={`
              w-full bg-transparent border-b-2 border-gray-600
              focus:border-[#D97757] focus:outline-none
              text-xl font-light text-white
              placeholder:text-gray-500
              transition-colors duration-200
              py-2 resize-none
            `}
          />
          <div className="mt-4">
            <button
              onClick={onSubmit}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D97757] text-white rounded-lg hover:bg-[#C86647] transition-colors font-medium"
            >
              OK
              <span className="text-gray-300 text-sm">press Cmd + Enter</span>
            </button>
          </div>
        </div>
      )}

      {value === null && (
        <p className="mt-4 text-gray-400 text-sm">
          Press <span className="font-mono bg-gray-700 px-1 rounded">Y</span> for
          Yes or <span className="font-mono bg-gray-700 px-1 rounded">N</span>{" "}
          for No
        </p>
      )}
    </div>
  );
}
