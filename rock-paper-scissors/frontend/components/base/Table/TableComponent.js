"use client";

import clsx from "clsx";

export function TableComponent({ children, className }) {
  return (
    <td
      className={clsx(
        `border-r border-[#134E4A] text-white text-xs px-4 xl:p-6 ${className}`
      )}
    >
      {children}
    </td>
  );
}
