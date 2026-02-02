"use client";

import { Input } from "@/components/ui/Input";
import { FieldConfig } from "@/lib/schemas/criteria";

interface DateFieldProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function DateField({ field, value, onChange, error, disabled }: DateFieldProps) {
  return (
    <Input
      type="date"
      label={field.label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      hint={field.hint}
      error={error}
      required={field.required}
      disabled={disabled}
    />
  );
}
