"use client";

import { ImportMethodTab } from "./ImportMethodTab";
import { IMPORT_METHODS, type ImportMethod } from "./constants";

type ImportMethodSwitchProps = {
  method: ImportMethod;
  onChange: (method: ImportMethod) => void;
};

export const ImportMethodSwitch = ({
  method,
  onChange,
}: ImportMethodSwitchProps) => (
  <div className="border-border inline-flex w-fit rounded-full border p-1">
    {IMPORT_METHODS.map((value) => (
      <ImportMethodTab
        key={value}
        method={value}
        active={method === value}
        onSelect={onChange}
      />
    ))}
  </div>
);
