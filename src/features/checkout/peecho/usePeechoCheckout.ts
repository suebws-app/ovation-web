"use client";

import { useCallback, useEffect, useRef } from "react";
import { clientEnv as env } from "@/lib/utils/env.client";
import type { PeechoCheckoutParams } from "@/lib/api/types";

const SCRIPT_ID = "peecho-print-button-script";
const BUTTON_CLASS = "peecho-print-button";
const PLACEHOLDER_HREF = "https://www.peecho.com";
const WIRE_TIMEOUT_MS = 3000;
const POLL_INTERVAL_MS = 100;

type PeechoGlobal = { attach?: () => void };

let scriptPromise: Promise<boolean> | null = null;

const getPeechoGlobal = (): PeechoGlobal | undefined =>
  (window as Window & { peecho?: PeechoGlobal }).peecho;

const loadPeechoScript = (): Promise<boolean> => {
  if (!env.PEECHO_BUTTON_URL) return Promise.resolve(false);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<boolean>((resolve) => {
    if (document.getElementById(SCRIPT_ID)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = env.PEECHO_BUTTON_URL;
    script.onload = () => resolve(true);
    script.onerror = () => {
      script.remove();
      scriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const buildAnchor = (params: PeechoCheckoutParams): HTMLAnchorElement => {
  const anchor = document.createElement("a");
  anchor.setAttribute("href", PLACEHOLDER_HREF);
  anchor.className = BUTTON_CLASS;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  anchor.dataset.filetype = "pdf";
  anchor.dataset.reference = params.reference;
  anchor.dataset.pages = String(params.pages);
  anchor.dataset.width = String(params.widthMm);
  anchor.dataset.height = String(params.heightMm);
  anchor.dataset.currency = params.currency;
  anchor.dataset.locale = params.locale;
  anchor.dataset.secure = "true";
  anchor.dataset.src = `${window.location.origin}/peecho-print-source/${params.reference}.pdf`;
  anchor.dataset.redirectThankyou = params.successUrl;
  anchor.dataset.redirectCancel = window.location.href;
  anchor.dataset.redirectError = window.location.href;
  if (params.thumbnailUrl) anchor.dataset.thumbnail = params.thumbnailUrl;
  document.body.appendChild(anchor);
  return anchor;
};

type WireOutcome = "okay" | "error" | "disabled" | "timeout";

export type PeechoOpenResult = {
  opened: boolean;
  reason?: "env_missing" | "script_failed" | WireOutcome;
  peechoMessage?: string;
};

const waitUntilWired = async (
  anchor: HTMLAnchorElement,
): Promise<WireOutcome> => {
  const deadline = Date.now() + WIRE_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (anchor.classList.contains("peecho-btn-okay")) return "okay";
    if (anchor.classList.contains("peecho-btn-error")) return "error";
    if (anchor.classList.contains("peecho-btn-disabled")) return "disabled";
    getPeechoGlobal()?.attach?.();
    await sleep(POLL_INTERVAL_MS);
  }
  return "timeout";
};

const triggerCheckout = (anchor: HTMLAnchorElement) => {
  anchor.dispatchEvent(new MouseEvent("mouseup", { bubbles: false }));
};

export const usePeechoCheckout = () => {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const removeAnchor = useCallback(() => {
    anchorRef.current?.remove();
    anchorRef.current = null;
  }, []);

  const open = useCallback(
    async (params: PeechoCheckoutParams): Promise<PeechoOpenResult> => {
      removeAnchor();
      if (!env.PEECHO_BUTTON_URL) {
        return { opened: false, reason: "env_missing" };
      }
      const loaded = await loadPeechoScript();
      if (!loaded) return { opened: false, reason: "script_failed" };

      const anchor = buildAnchor(params);
      anchorRef.current = anchor;
      getPeechoGlobal()?.attach?.();

      const outcome = await waitUntilWired(anchor);
      if (outcome !== "okay") {
        const result: PeechoOpenResult = {
          opened: false,
          reason: outcome,
          peechoMessage:
            anchor.getAttribute("data-auto-tooltip") ??
            anchor.title ??
            undefined,
        };
        console.error("[peecho-checkout] failed to wire print button", {
          ...result,
          anchorClass: anchor.className,
          hasPeechoGlobal: !!getPeechoGlobal(),
          hasAttach: !!getPeechoGlobal()?.attach,
        });
        return result;
      }
      triggerCheckout(anchor);
      return { opened: true };
    },
    [removeAnchor],
  );

  const reopen = useCallback(() => {
    if (anchorRef.current) triggerCheckout(anchorRef.current);
  }, []);

  useEffect(() => removeAnchor, [removeAnchor]);

  return { open, reopen };
};
