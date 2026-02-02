"use client";

import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { FieldConfig } from "@/lib/schemas/criteria";

interface TextFieldProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function TextField({ field, value, onChange, error, disabled }: TextFieldProps) {
  if (field.type === "textarea") {
    return (
      <TextArea
        label={field.label}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        hint={field.hint}
        error={error}
        required={field.required}
        disabled={disabled}
      />
    );
  }

  return (
    <Input
      type="text"
      label={field.label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      hint={field.hint}
      error={error}
      required={field.required}
      disabled={disabled}
    />
  );
}
