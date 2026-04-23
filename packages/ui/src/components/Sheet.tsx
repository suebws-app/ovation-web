"use client"

import { Dialog, VisuallyHidden } from "radix-ui"
import { forwardRef } from "react"
import { cn } from "../utils/cn"

const Sheet = Dialog.Root
const SheetTrigger = Dialog.Trigger
const SheetClose = Dialog.Close
const SheetPortal = Dialog.Portal

const SheetOverlay = forwardRef<
  React.ComponentRef<typeof Dialog.Overlay>,
  React.ComponentProps<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = "SheetOverlay"

type SheetContentProps = React.ComponentProps<typeof Dialog.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}

const SheetContent = forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Dialog.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col gap-4 bg-card shadow-lg transition-transform duration-300 ease-in-out",
        side === "left" &&
          "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-border data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0",
        side === "right" &&
          "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-border data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
        side === "top" &&
          "inset-x-0 top-0 border-b border-border data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0",
        side === "bottom" &&
          "inset-x-0 bottom-0 border-t border-border data-[state=closed]:translate-y-full data-[state=open]:translate-y-0",
        className
      )}
      {...props}
    >
      {children}
    </Dialog.Content>
  </SheetPortal>
))
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex flex-col gap-2 p-4", className)} {...props} />
)

const SheetTitle = forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentProps<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("type-body font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = forwardRef<
  React.ComponentRef<typeof Dialog.Description>,
  React.ComponentProps<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn("type-body-small text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  VisuallyHidden,
}
