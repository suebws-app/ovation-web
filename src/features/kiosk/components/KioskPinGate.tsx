"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useTranslations } from "next-intl";
import { LockIcon } from "@ovation/icons/LockIcon";
import { publicClient } from "@/lib/api/public-client";
import { ApiError } from "@/lib/api/client";

type KioskPinGateProps = {
  slug: string;
  children: React.ReactNode;
};

const storageKey = (slug: string) => `kiosk-access:${slug}`;
const ACCESS_GRANTED_EVENT = "kiosk-pin-gate:granted";

const subscribeAccess = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(ACCESS_GRANTED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ACCESS_GRANTED_EVENT, callback);
  };
};

const getAccessSnapshot = (slug: string) => () => {
  try {
    return window.sessionStorage.getItem(storageKey(slug)) === "1";
  } catch {
    return false;
  }
};

const getAccessServerSnapshot = () => false;

const grantAccess = (slug: string) => {
  try {
    window.sessionStorage.setItem(storageKey(slug), "1");
  } catch {
    // sessionStorage may be disabled; gate will re-prompt next visit.
  }
  window.dispatchEvent(new Event(ACCESS_GRANTED_EVENT));
};

export const KioskPinGate = ({ slug, children }: KioskPinGateProps) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const accessSnapshot = useMemo(() => getAccessSnapshot(slug), [slug]);
  const hasAccess = useSyncExternalStore(
    subscribeAccess,
    accessSnapshot,
    getAccessServerSnapshot,
  );

  const [pin, setPin] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!hasAccess) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [hasAccess]);

  if (hasAccess) return <>{children}</>;

  const submit = async () => {
    if (pin.length !== 4 || verifying) return;
    setVerifying(true);
    setErrorKey(null);
    try {
      await publicClient.verifyKioskPin(slug, pin);
      grantAccess(slug);
    } catch (error) {
      if (ApiError.isApiError(error) && error.status === 429) {
        setErrorKey("kiosk__gate__rate_limited");
      } else {
        setErrorKey("kiosk__gate__wrong");
      }
      setPin("");
      inputRef.current?.focus();
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      className="bg-foreground/95 fixed inset-0 z-[80] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kiosk-pin-gate-title"
    >
      <div className="rounded-20 bg-card flex w-full max-w-sm flex-col items-center gap-4 p-7 shadow-lg">
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
          <LockIcon width={20} height={20} />
        </div>
        <h2
          id="kiosk-pin-gate-title"
          className="type-h3 font-semibold tracking-tight"
        >
          {t("kiosk__gate__title")}
        </h2>
        <p className="type-body-small text-muted-foreground text-center">
          {t("kiosk__gate__hint")}
        </p>
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          autoComplete="off"
          value={pin}
          disabled={verifying}
          onChange={(e) => {
            setErrorKey(null);
            setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          className="border-border focus:border-primary type-h2 w-40 rounded-full border-2 px-4 py-2 text-center font-mono tracking-widest transition-colors outline-none disabled:opacity-60"
          placeholder="••••"
        />
        {errorKey && (
          <p className="type-body-small text-destructive" role="alert">
            {t(errorKey)}
          </p>
        )}
        <button
          type="button"
          onClick={submit}
          disabled={pin.length !== 4 || verifying}
          className="bg-primary text-primary-foreground hover:bg-primary/90 type-body-small mt-2 w-full cursor-pointer rounded-full px-4 py-2.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifying ? t("kiosk__gate__verifying") : t("kiosk__gate__submit")}
        </button>
      </div>
    </div>
  );
};
