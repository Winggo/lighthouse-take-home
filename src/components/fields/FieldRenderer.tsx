"use client";

import { FieldConfig } from "@/lib/schemas/criteria";
import { TextField } from "./TextField";
import { DateField } from "./DateField";
import { UrlField } from "./UrlField";
import { MultiUrlField } from "./MultiUrlField";
import { MultiFileField } from "./MultiFileField";

interface FieldRendererProps {
  field: FieldConfig;
  value: string | string[] | null;
  onChange: (value: string | string[]) => void;
  error?: string;
  disabled?: boolean;
}

export function FieldRenderer({ field, value, onChange, error, disabled }: FieldRendererProps) {
  switch (field.type) {
    case "text":
    case "textarea":
      return (
        <TextField
          field={field}
          value={value as string}
          onChange={onChange as (v: string) => void}
          error={error}
          disabled={disabled}
        />
      );

    case "date":
      return (
        <DateField
          field={field}
          value={value as string}
          onChange={onChange as (v: string) => void}
          error={error}
          disabled={disabled}
        />
      );

    case "url":
      return (
        <UrlField
          field={field}
          value={value as string}
          onChange={onChange as (v: string) => void}
          error={error}
          disabled={disabled}
        />
      );

    case "urls":
      return (
        <MultiUrlField
          field={field}
          value={(value as string[]) || [""]}
          onChange={onChange as (v: string[]) => void}
          error={error}
          disabled={disabled}
        />
      );

    case "files":
      return (
        <MultiFileField
          field={field}
          value={(value as string[]) || []}
          onChange={onChange as (v: string[]) => void}
          error={error}
          disabled={disabled}
        />
      );

    default:
      return null;
  }
}
