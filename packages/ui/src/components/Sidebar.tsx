"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@ovation/ui/utils/cn";
import { useIsMobile } from "@ovation/ui/hooks/useIsMobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  VisuallyHidden,
} from "@ovation/ui/components/Sheet";

const SIDEBAR_WIDTH = "220px";
const SIDEBAR_WIDTH_MOBILE = "280px";
const SIDEBAR_WIDTH_ICON = "48px";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
};

type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const SidebarProvider = forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = useState(false);
    const [_open, _setOpen] = useState(defaultOpen);
    const open = openProp ?? _open;

    const setOpen = useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
      },
      [setOpenProp, open],
    );

    const toggleSidebar = useCallback(() => {
      return isMobile
        ? setOpenMobile((prev) => !prev)
        : setOpen((prev) => !prev);
    }, [isMobile, setOpen]);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      ],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";

type SidebarProps = React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
};

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <div
          ref={ref}
          data-slot="sidebar"
          className={cn(
            "flex h-full w-[var(--sidebar-width)] flex-col bg-sidebar text-sidebar-foreground",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            data-sidebar="sidebar"
            data-slot="sidebar"
            data-mobile="true"
            className="w-[var(--sidebar-width)] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetHeader className="sr-only">
              <VisuallyHidden.Root>
                <SheetTitle>Sidebar</SheetTitle>
              </VisuallyHidden.Root>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        className="group peer hidden text-sidebar-foreground desktop:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        data-slot="sidebar"
      >
        <div
          data-slot="sidebar-gap"
          className={cn(
            "relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+16px)]"
              : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]",
          )}
        />
        <div
          data-slot="sidebar-container"
          data-side={side}
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear desktop:flex",
            side === "left" && "left-0",
            side === "right" && "right-0",
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+16px+2px)]"
              : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]",
            className,
          )}
        >
          <div
            data-slot="sidebar-inner"
            className={cn(
              "flex h-full w-full flex-col bg-sidebar",
              variant === "floating" &&
                "overflow-hidden rounded-12 border border-sidebar-border shadow",
              variant === "inset" && "overflow-hidden rounded-12",
              variant === "sidebar" && "border-r border-sidebar-border",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

export const SidebarTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-slot="sidebar-trigger"
      type="button"
      className={cn(
        "inline-flex size-8 cursor-pointer items-center justify-center rounded-8 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarInset = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => (
  <main
    ref={ref}
    data-slot="sidebar-inset"
    className={cn(
      "relative flex min-h-svh w-full flex-1 flex-col max-w-container  mx-auto",
      className,
    )}
    {...props}
  />
));
SidebarInset.displayName = "SidebarInset";

export const SidebarHeader = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-header"
    className={cn("flex flex-col gap-2 p-4", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-footer"
    className={cn("flex flex-col gap-2 p-4", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

export const SidebarContent = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-content"
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
      className,
    )}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

export const SidebarGroup = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-group"
    className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      data-slot="sidebar-group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-8 px-2 type-caption font-semibold tracking-wider uppercase text-sidebar-foreground/60 outline-none",
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarMenu = forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-slot="sidebar-menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-slot="sidebar-menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
};

export const SidebarMenuButton = forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      asChild = false,
      isActive = false,
      size = "default",
      className,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        data-slot="sidebar-menu-button"
        data-active={isActive}
        className={cn(
          "peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded-10 px-3 type-body-small font-medium text-sidebar-foreground/80 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-5 [&>svg]:shrink-0",
          size === "default" && "min-h-9 py-2",
          size === "sm" && "min-h-7 py-1 type-caption",
          size === "lg" && "min-h-11 py-3",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarMenuBadge = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-menu-badge"
    className={cn(
      "pointer-events-none absolute right-2 flex h-5 min-w-5 select-none items-center justify-center rounded-8 bg-primary px-1 type-caption font-semibold text-primary-foreground",
      className,
    )}
    {...props}
  />
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";

export const SidebarSeparator = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-separator"
    className={cn("mx-2 h-px bg-sidebar-border", className)}
    {...props}
  />
));
SidebarSeparator.displayName = "SidebarSeparator";
