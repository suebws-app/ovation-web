"use client";

import {
  useEffect,
  useRef,
  useState,
  startTransition,
  type RefObject,
} from "react";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import { KioskExitDialog } from "./KioskExitDialog";

type KioskFullscreenGuardProps = {
  slug: string;
  requiresPin: boolean;
  active: boolean;
  skipNextExitRef?: RefObject<boolean>;
};

export const KioskFullscreenGuard = ({
  slug,
  requiresPin,
  active,
  skipNextExitRef,
}: KioskFullscreenGuardProps) => {
  const { isFullscreen, isSupported, enter: enterFullscreen } = useFullscreen();
  const [open, setOpen] = useState(false);
  const wasFullscreenRef = useRef(false);

  useEffect(() => {
    if (!active || !isSupported) {
      wasFullscreenRef.current = isFullscreen;
      return;
    }
    const justExited = wasFullscreenRef.current && !isFullscreen;
    wasFullscreenRef.current = isFullscreen;
    if (!justExited) return;
    if (skipNextExitRef?.current) {
      skipNextExitRef.current = false;
      return;
    }
    if (requiresPin) startTransition(() => setOpen(true));
  }, [active, isSupported, isFullscreen, requiresPin, skipNextExitRef]);

  const handleConfirm = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    if (active && !isFullscreen) {
      enterFullscreen();
    }
  };

  return (
    <KioskExitDialog
      open={open}
      slug={slug}
      requiresPin={requiresPin}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    />
  );
};
