import * as React from "react";

export interface AccordionItem { q: React.ReactNode; a: React.ReactNode; }

export interface AccordionProps {
  /** FAQ entries. */
  items: AccordionItem[];
  /** Index open on mount (-1 for all closed). @default 0 */
  defaultOpen?: number;
  style?: React.CSSProperties;
}

/** Quiet single-open FAQ accordion with soft expand. */
export function Accordion(props: AccordionProps): JSX.Element;
