"use client";

import clsx from "clsx";

export function TableBody({ children, className }) {
  return (
    <tbody
      className={clsx(
        `w-full h-auto bg-[#032E31] border border-[#134E4A] p-4 items-center justify-center relative ${className}`
      )}
    >
      {children}
      <tr className="absolute flex -inset-x-[10px] inset-y-[10px] border border-[#134E4A] -z-10 items-center p-0">
        <td className="w-full h-px bg-[#134E4A]"></td>
      </tr>
    </tbody>
  );
}
