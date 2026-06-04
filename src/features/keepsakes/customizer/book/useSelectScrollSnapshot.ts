import { useCallback, useRef } from "react";

export const useSelectScrollSnapshot = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scrollSnapshotRef = useRef<{ el: HTMLElement; top: number } | null>(
    null,
  );

  const findScrollContainer = (): HTMLElement | null => {
    let node: HTMLElement | null = rootRef.current;
    while (node) {
      const style = getComputedStyle(node);
      if (
        /(auto|scroll)/.test(style.overflowY) &&
        node.scrollHeight > node.clientHeight
      ) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  };

  const onSelectOpenChange = useCallback((open: boolean) => {
    if (open) {
      const el = findScrollContainer();
      if (el) scrollSnapshotRef.current = { el, top: el.scrollTop };
      return;
    }
    const snap = scrollSnapshotRef.current;
    if (!snap) return;
    const restore = () => {
      snap.el.scrollTop = snap.top;
    };
    requestAnimationFrame(restore);
    requestAnimationFrame(() => requestAnimationFrame(restore));
    scrollSnapshotRef.current = null;
  }, []);

  return { rootRef, onSelectOpenChange };
};
