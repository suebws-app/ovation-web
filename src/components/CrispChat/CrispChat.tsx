"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { useSession } from "@/lib/auth/client";

const IDLE_FALLBACK_DELAY_MS = 10000;
const INTERACTION_EVENTS: (keyof WindowEventMap)[] = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
];
const CRISP_SCRIPT_ID = "crisp-widget";

const ALWAYS_HIDDEN_PATH_PREFIXES = ["/g"];

const HIDDEN_PATH_PREFIXES = [
  "/i",
  "/kiosk",
  "/redeem",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const matchesPrefix = (pathname: string, prefixes: string[]) =>
  prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

const isPathAlwaysHidden = (pathname: string) =>
  matchesPrefix(pathname, ALWAYS_HIDDEN_PATH_PREFIXES);

const isPathHidden = (pathname: string) =>
  matchesPrefix(pathname, HIDDEN_PATH_PREFIXES);

type CrispQueue = { push: (command: unknown[]) => void };

type CrispWindow = Window & {
  $crisp?: CrispQueue;
  CRISP_WEBSITE_ID?: string;
};

const ensureCrispQueue = (websiteId: string) => {
  const w = window as CrispWindow;
  if (!w.$crisp) {
    w.$crisp = [] as unknown as CrispQueue;
  }
  w.CRISP_WEBSITE_ID = websiteId;
  return w.$crisp;
};

const injectCrispScript = () => {
  if (document.getElementById(CRISP_SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = CRISP_SCRIPT_ID;
  script.async = true;
  script.src = "https://client.crisp.chat/l.js";
  document.head.appendChild(script);
};

export const CrispChat = ({ websiteId }: { websiteId: string }) => {
  const scriptLoadedRef = useRef(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;
  const shouldShow =
    !isPathAlwaysHidden(pathname) &&
    (isAuthenticated || !isPathHidden(pathname));

  useEffect(() => {
    if (!shouldShow || scriptLoadedRef.current) return;

    ensureCrispQueue(websiteId);

    const cleanups: (() => void)[] = [];
    const runCleanups = () => cleanups.forEach((cleanup) => cleanup());

    const load = () => {
      if (scriptLoadedRef.current) return;
      scriptLoadedRef.current = true;
      runCleanups();
      injectCrispScript();
    };

    INTERACTION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, load, { once: true, passive: true });
      cleanups.push(() => window.removeEventListener(eventName, load));
    });

    const timer = window.setTimeout(load, IDLE_FALLBACK_DELAY_MS);
    cleanups.push(() => window.clearTimeout(timer));

    return runCleanups;
  }, [websiteId, shouldShow]);

  useEffect(() => {
    if (!scriptLoadedRef.current) return;
    const w = window as CrispWindow;
    w.$crisp?.push(["do", shouldShow ? "chat:show" : "chat:hide"]);
  }, [shouldShow]);

  const email = session?.user?.email;
  const name = session?.user?.name;

  useEffect(() => {
    if (!email && !name) return;
    if (!scriptLoadedRef.current) {
      ensureCrispQueue(websiteId);
    }
    const w = window as CrispWindow;
    if (email) w.$crisp?.push(["set", "user:email", [email]]);
    if (name) w.$crisp?.push(["set", "user:nickname", [name]]);
  }, [email, name, websiteId]);

  return null;
};
