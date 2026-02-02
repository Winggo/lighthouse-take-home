"use client";

import { Button } from "@/components/ui/Button";
import { FieldConfig } from "@/lib/schemas/criteria";
import { useRef } from "react";

interface MultiFileFieldProps {
  field: FieldConfig;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function MultiFileField({ field, value, onChange, error }: MultiFileFieldProps) {
  const files = value || [];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFileNames = Array.from(selectedFiles).map(file => file.name);
      onChange([...files, ...newFileNames]);
      // Reset the input so the same file can be selected again if removed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
      />

      {/* Display selected files */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileName, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#1a2a26] rounded border border-gray-700"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm text-gray-300 truncate">{fileName}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 px-2 ml-2 flex-shrink-0"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={triggerFileInput}
      >
        + Add file(s)
      </Button>

      {field.hint && !error && (
        <p className="text-sm text-gray-400">{field.hint}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
