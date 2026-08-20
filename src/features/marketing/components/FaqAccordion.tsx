import { PlusIcon } from "@ovation/icons/PlusIcon";
import { MinusIcon } from "@ovation/icons/MinusIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ovation/ui/components/Accordion";
import { cn } from "@ovation/ui/utils/cn";

export type FaqAccordionItem = {
  key: string;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqAccordionItem[];
  className?: string;
};

export const FaqAccordion = ({ items, className }: FaqAccordionProps) => (
  <Accordion type="single" collapsible className={cn("mt-8", className)}>
    {items.map((item, index) => (
      <AccordionItem key={item.key} value={`faq-${index}`}>
        <AccordionTrigger className="type-body-large items-center gap-6 py-5 text-left font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
          {item.question}
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
        <AccordionContent className="text-muted-foreground type-body max-w-160 leading-relaxed">
          {item.answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);
