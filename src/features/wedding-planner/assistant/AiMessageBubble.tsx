import { cn } from "@ovation/ui/utils/cn";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import type { AiMessage } from "../types";

const renderInline = (text: string, keyBase: number) =>
  text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((segment, index) =>
      segment.startsWith("**") && segment.endsWith("**") ? (
        <strong key={`${keyBase}-${index}`}>{segment.slice(2, -2)}</strong>
      ) : (
        <span key={`${keyBase}-${index}`}>{segment}</span>
      ),
    );

const renderMarkdown = (text: string) =>
  text.split("\n").map((line, index) => {
    if (line.trim() === "") {
      return <div key={index} className="h-2" aria-hidden />;
    }
    const heading = line.match(/^\s*#{1,6}\s+(.*)$/);
    if (heading) {
      return (
        <p key={index} className="type-body mt-2 font-semibold first:mt-0">
          {renderInline(heading[1], index)}
        </p>
      );
    }
    return <p key={index}>{renderInline(line, index)}</p>;
  });

export const AiMessageBubble = ({
  message,
  error,
}: {
  message: AiMessage;
  error?: boolean;
}) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex max-w-lg gap-3",
        isUser ? "flex-row-reverse self-end" : "self-start",
      )}
    >
      {!isUser ? (
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            error ? "bg-destructive" : "bg-foreground",
          )}
        >
          <HeartIcon
            width={16}
            height={16}
            className={error ? "text-destructive-foreground" : "text-primary"}
          />
        </span>
      ) : null}
      <div
        className={cn(
          "rounded-16 type-body-small px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : error
              ? "border-destructive/40 bg-destructive/5 text-foreground border"
              : "bg-muted/50 border-border border",
        )}
      >
        {renderMarkdown(message.text)}
      </div>
    </div>
  );
};
