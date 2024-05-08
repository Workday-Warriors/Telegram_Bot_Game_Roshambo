"use client";

import clsx from "clsx";

export default function Button({
  className,
  children,
  style,
  onClick,
  disabled,
}) {
  return (
    <div
      className={clsx("flex w-full sm:w-fit h-12 relative cursor-pointer", {
        ["pointer-events-none"]: disabled,
      })}
      onClick={onClick}
    >
      <div
        className={clsx(
          `flex w-full sm:w-fit h-12 p-2 rounded-[2px] bg-button text-[#041C28] items-center justify-center gap-3 z-20 ${className}`,
          {
            ["bg-[#093A37] border border-[#134E4A] text-[#779A98]"]: disabled,
          }
        )}
      >
        {children}
      </div>
      <div
        className={clsx(
          "absolute -inset-[1px] rounded-[2px] blur-sm bg-button z-10",
          {
            ["hidden"]: disabled,
          }
        )}
      ></div>
    </div>
  );
}
