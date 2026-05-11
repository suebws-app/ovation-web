"use client";

import { useEffect } from "react";
import { useCurrentEventStore } from "./useCurrentEventStore";

type EventLabelSyncProps = {
  label: string;
};

export const EventLabelSync = ({ label }: EventLabelSyncProps) => {
  const { setLabel, clearLabel } = useCurrentEventStore();

  useEffect(() => {
    setLabel(label);
    return () => clearLabel();
  }, [label, setLabel, clearLabel]);

  return null;
};
