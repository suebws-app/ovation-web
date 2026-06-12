import { forwardRef } from "react";
import { cn } from "../utils/cn";
import { Skeleton } from "./Skeleton";

export const Table = forwardRef<
  HTMLTableElement,
  React.ComponentProps<"table">
>(({ className, ...props }, ref) => (
  <div className="@container/table relative w-full overflow-x-auto">
    <table
      ref={ref}
      className={cn("type-body-small w-full caption-bottom", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"thead">
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-background [&_tr]:hover:bg-transparent", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tbody">
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tfoot">
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "bg-muted/50 border-border border-t font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export const TableRow = forwardRef<
  HTMLTableRowElement,
  React.ComponentProps<"tr">
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-border hover:bg-muted/40 data-[state=selected]:bg-muted border-b transition-colors",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"th">
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "type-overline text-muted-foreground px-2 py-3 text-left align-middle font-medium first:pl-4 last:pr-4 @[740px]/table:first:pl-6 @[740px]/table:last:pr-6",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"td">
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-2 py-3.5 align-middle first:pl-4 last:pr-4 @[740px]/table:first:pl-6 @[740px]/table:last:pr-6",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  React.ComponentProps<"caption">
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("type-caption text-muted-foreground mt-4", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export type TableSkeletonColumnVariant =
  | "checkbox"
  | "avatar"
  | "icon"
  | "text"
  | "badge"
  | "action"
  | "spacer";

export type TableSkeletonColumn = {
  variant: TableSkeletonColumnVariant;
  className?: string;
};

type TableSkeletonProps = {
  columns: TableSkeletonColumn[];
  rows?: number;
  showHeader?: boolean;
  className?: string;
};

const TableSkeletonCellContent = ({
  variant,
}: {
  variant: TableSkeletonColumnVariant;
}) => {
  switch (variant) {
    case "checkbox":
      return <Skeleton className="size-4" />;
    case "avatar":
      return (
        <div className="flex min-w-0 items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-32 max-w-full" />
            <Skeleton className="h-3 w-48 max-w-full" />
          </div>
        </div>
      );
    case "icon":
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="size-3.5" />
          <Skeleton className="size-3.5" />
        </div>
      );
    case "badge":
      return <Skeleton className="h-6 w-16 rounded-full" />;
    case "action":
      return (
        <div className="flex justify-end">
          <Skeleton className="size-8 rounded-full" />
        </div>
      );
    case "spacer":
      return null;
    default:
      return <Skeleton className="h-3 w-20" />;
  }
};

const TableSkeletonHeadCell = ({ variant, className }: TableSkeletonColumn) => (
  <TableHead className={className}>
    {variant === "checkbox" ? (
      <Skeleton className="size-4" />
    ) : variant === "action" || variant === "spacer" ? null : (
      <Skeleton className="h-3 w-12" />
    )}
  </TableHead>
);

const TableSkeletonBodyCell = ({ variant, className }: TableSkeletonColumn) => (
  <TableCell className={className}>
    <TableSkeletonCellContent variant={variant} />
  </TableCell>
);

const TableSkeletonRow = ({ columns }: { columns: TableSkeletonColumn[] }) => (
  <TableRow className="hover:bg-transparent">
    {columns.map((column, i) => (
      <TableSkeletonBodyCell key={i} {...column} />
    ))}
  </TableRow>
);

export const TableSkeleton = ({
  columns,
  rows = 10,
  showHeader = true,
  className,
}: TableSkeletonProps) => (
  <Table className={className}>
    {showHeader && (
      <TableHeader>
        <TableRow>
          {columns.map((column, i) => (
            <TableSkeletonHeadCell key={i} {...column} />
          ))}
        </TableRow>
      </TableHeader>
    )}
    <TableBody>
      {Array.from({ length: rows }, (_, i) => (
        <TableSkeletonRow key={i} columns={columns} />
      ))}
    </TableBody>
  </Table>
);
