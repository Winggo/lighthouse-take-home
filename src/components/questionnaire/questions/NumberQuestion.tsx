"use client";

import { KeyboardEvent, useRef, useEffect } from "react";

interface NumberQuestionProps {
  value: number | string | null;
  onChange: (value: number | string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isCurrency?: boolean;
}

export function NumberQuestion({
  value,
  onChange,
  onSubmit,
  placeholder,
  isCurrency = false,
}: NumberQuestionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");

    if (isCurrency) {
      // Store as formatted string for currency
      onChange(rawValue);
    } else {
      // Store as number for years of experience
      const num = parseInt(rawValue, 10);
      onChange(isNaN(num) ? "" : num);
    }
  };

  const formatDisplayValue = (val: number | string | null): string => {
    if (val === null || val === "") return "";

    if (isCurrency) {
      const numStr = String(val).replace(/[^0-9]/g, "");
      if (!numStr) return "";
      return parseInt(numStr, 10).toLocaleString();
    }

    return String(val);
  };

  return (
    <div>
      <div className="flex items-baseline">
        {isCurrency && (
          <span className="text-2xl md:text-3xl font-light text-gray-400 mr-2">
            $
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={formatDisplayValue(value)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            flex-1 bg-transparent border-b-2 border-gray-600
            focus:border-[#D97757] focus:outline-none
            text-2xl md:text-3xl font-light text-white
            placeholder:text-gray-500
            transition-colors duration-200
            py-2
          `}
        />
        {isCurrency && (
          <span className="text-lg text-gray-400 ml-2">USD / year</span>
        )}
        {!isCurrency && (
          <span className="text-lg text-gray-400 ml-2">years</span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D97757] text-white rounded-lg hover:bg-[#C86647] transition-colors font-medium"
        >
          OK
          <span className="text-gray-300 text-sm flex items-center gap-1">
            press Enter <span className="text-lg">↵</span>
          </span>
        </button>
      </div>
    </div>
  );
}
