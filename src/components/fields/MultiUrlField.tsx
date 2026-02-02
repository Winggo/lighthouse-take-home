"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FieldConfig } from "@/lib/schemas/criteria";

interface MultiUrlFieldProps {
  field: FieldConfig;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function MultiUrlField({ field, value, onChange, error }: MultiUrlFieldProps) {
  const urls = value || [""];

  const handleUrlChange = (index: number, newUrl: string) => {
    const newUrls = [...urls];
    newUrls[index] = newUrl;
    onChange(newUrls);
  };

  const addUrl = () => {
    onChange([...urls, ""]);
  };

  const removeUrl = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      onChange(newUrls);
    }
  };

  return (
    <div className="w-full space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {urls.map((url, index) => (
        <div key={index} className="flex gap-2">
          <Input
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(index, e.target.value)}
            placeholder="https://drive.google.com/..."
            className="flex-1"
          />
          {urls.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeUrl(index)}
              className="text-red-500 hover:text-red-700 px-2"
            >
              Remove
            </Button>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addUrl}
      >
        + Add another URL
      </Button>

      {field.hint && !error && (
        <p className="text-sm text-gray-400">{field.hint}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
