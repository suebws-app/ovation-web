import { PlusIcon } from "@ovation/icons/PlusIcon";
import { MinusIcon } from "@ovation/icons/MinusIcon";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ovation/ui/components/Accordion";
import { FAQAnswer } from "../../../FAQAnswer";
import type { FAQ_ITEM_KEYS } from "../../../constants";

type FaqItemProps = {
  value: string;
  question: string;
  answerKey: (typeof FAQ_ITEM_KEYS)[number]["a"];
  fallbackPrice: string;
};

export const FaqItem = ({
  value,
  question,
  answerKey,
  fallbackPrice,
}: FaqItemProps) => (
  <AccordionItem value={value}>
    <AccordionTrigger className="type-body-large items-center gap-6 py-5 font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
      {question}
      <span className="border-border text-muted-foreground ml-auto flex size-6 shrink-0 items-center justify-center rounded-full border">
        <PlusIcon
          className="size-3.5 group-aria-expanded/accordion-trigger:hidden"
          aria-hidden
        />
        <MinusIcon
          className="hidden size-3.5 group-aria-expanded/accordion-trigger:inline"
          aria-hidden
        />
      </span>
    </AccordionTrigger>
    <AccordionContent
      forceMount
      className="text-muted-foreground type-body max-w-160 leading-relaxed"
    >
      <FAQAnswer answerKey={answerKey} dreFallbackPrice={fallbackPrice} />
    </AccordionContent>
  </AccordionItem>
);
