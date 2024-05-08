"use client";

import clsx from "clsx";

export function TableRow({ children, className }) {
  return (
    <tr className={clsx(`h-16 border-[#134E4A] ${className}`)}>{children}</tr>
  );
}
