"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { PlusIcon } from "@ovation/icons/PlusIcon";

type AddCategoryRowProps = {
  onAdd: (name: string) => void;
};

export const AddCategoryRow = ({ onAdd }: AddCategoryRowProps) => {
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
      className="flex items-center gap-2"
    >
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t("wp__budget__add_category")}
        aria-label={t("wp__budget__add_category")}
        className="border-border rounded-10 bg-card type-body-small flex-1 border px-3 py-2 outline-none"
      />
      <Button type="submit" size="sm" disabled={!value.trim()}>
        <PlusIcon width={15} height={15} />
        {t("wp__budget__add_category")}
      </Button>
    </form>
  );
};
