"use client";

import { DashboardGreeting } from "./components/DashboardGreeting";
import { ResumeCard } from "./components/ResumeCard";
import { StatLine } from "./components/StatLine";
import { MessageList } from "./components/MessageList";
import { NudgeCard } from "./components/NudgeCard";

export const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <DashboardGreeting />
      <ResumeCard />
      <StatLine />
      <MessageList />
      <NudgeCard />
    </div>
  );
};
