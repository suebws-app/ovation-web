"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@ovation/icons/PlusIcon";

type AddTaskRowProps = {
  onAdd: (label: string) => void;
};

export const AddTaskRow = ({ onAdd }: AddTaskRowProps) => {
  const t = useTranslations();
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="rounded-10 border-border/70 flex items-center gap-2 border border-dashed p-2.5"
    >
      <PlusIcon
        width={15}
        height={15}
        className="text-muted-foreground shrink-0"
      />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t("wp__timeline__task_placeholder")}
        aria-label={t("wp__timeline__add_task")}
        className="type-body-small flex-1 bg-transparent outline-none"
      />
    </form>
  );
};
