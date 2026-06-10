import * as React from "react";

/**
 * Brow-service menu card with photo, price and duration.
 * @startingPoint section="Marketing" subtitle="Service menu card with photo, price & tag" viewport="700x400"
 */
export interface ServiceCardProps {
  /** Korean service name (display serif). */
  titleKo: string;
  /** Latin sub-label, e.g. "NATURAL". */
  titleEn?: string;
  description?: string;
  /** Formatted price string, e.g. "₩250,000". */
  price: string;
  /** Duration / note, e.g. "약 2시간 · 리터치 포함". */
  duration?: string;
  /** Corner ribbon label. */
  tag?: string;
  /** Photo URL; falls back to a warm placeholder. */
  image?: string;
  onSelect?: () => void;
  style?: React.CSSProperties;
}

export function ServiceCard(props: ServiceCardProps): JSX.Element;
