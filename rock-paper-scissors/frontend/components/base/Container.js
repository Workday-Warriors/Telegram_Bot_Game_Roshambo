"use client";

import clsx from "clsx";

export default function Container({ children, className }) {
  return (
    <div
      className={clsx(
        `flex h-auto flex-col bg-[#032E31] border border-[#134E4A] shadow-xl relative ${className}`
      )}
    >
      <div className="absolute flex -inset-x-[10px] inset-y-[10px] border border-[#134E4A] -z-10 items-center">
        <div className="w-full h-px bg-[#134E4A]"></div>
      </div>
      {children}
    </div>
  );
}
