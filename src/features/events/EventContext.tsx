"use client";

import { createContext, useContext } from "react";

const EventContext = createContext<string | null>(null);

export const EventContextProvider = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => <EventContext.Provider value={id}>{children}</EventContext.Provider>;

export const useEventId = () => useContext(EventContext);
