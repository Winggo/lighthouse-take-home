"use client";

import { Input } from "@/components/ui/Input";
import { FieldConfig } from "@/lib/schemas/criteria";

interface UrlFieldProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function UrlField({ field, value, onChange, error, disabled }: UrlFieldProps) {
  return (
    <Input
      type="url"
      label={field.label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || "https://..."}
      hint={field.hint}
      error={error}
      required={field.required}
      disabled={disabled}
    />
  );
}
