import type { JSX, ReactNode } from "react";
import { createElement, forwardRef } from "react";
import cn from "@/helpers/cn";

interface TypographyProps {
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
  className?: string;
}

export const H2 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ as = "h2", children, className = "" }, ref) =>
    createElement(
      as,
      { className: cn("text-3xl font-bold", className), ref },
      children
    )
);

export const H3 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ as = "h3", children, className = "" }, ref) =>
    createElement(
      as,
      { className: cn("text-2xl font-bold", className), ref },
      children
    )
);

export const H4 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ as = "h4", children, className = "" }, ref) =>
    createElement(
      as,
      { className: cn("text-xl font-bold", className), ref },
      children
    )
);

export const H5 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ as = "h5", children, className = "" }, ref) =>
    createElement(
      as,
      { className: cn("text-lg font-bold", className), ref },
      children
    )
);

export const H6 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ as = "h6", children, className = "" }, ref) =>
    createElement(
      as,
      { className: cn("text-sm font-bold", className), ref },
      children
    )
);
