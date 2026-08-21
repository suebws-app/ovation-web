"use client";

import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import type { FieldDef } from "@/lib/event-types";

type DynamicFieldProps = {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
};

const inputTypeFor = (field: FieldDef): string => {
  switch (field.kind) {
    case "date":
      return "date";
    case "int":
      return "number";
    case "url":
    case "image":
      return "url";
    default:
      return "text";
  }
};

export const DynamicField = ({ field, value, onChange }: DynamicFieldProps) => {
  const t = useTranslations();
  const label = t(field.labelKey);
  const id = `event-field-${field.key}`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={inputTypeFor(field)}
        value={value}
        maxLength={
          field.kind === "text" || field.kind === "longtext"
            ? field.max
            : undefined
        }
        min={field.kind === "int" ? field.min : undefined}
        max={field.kind === "int" ? field.max : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
