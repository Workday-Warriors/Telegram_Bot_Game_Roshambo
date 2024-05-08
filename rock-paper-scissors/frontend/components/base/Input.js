"use client";

import BigNumber from "bignumber.js";
import clsx from "clsx";

export default function Input({ onChange, unit, placeholder }) {
  return (
    <div className="flex w-full h-12 group bg-[#021E1F] text-[#ADD7D4] border focus-within:border-[#2DD4BF] focus-within:hover:border-[#2DD4BF] hover:border-[#0D9488] border-[#134E4A]  focus-within:bg-[#093A37]">
      <div
        className={clsx(
          "flex w-12 h-full p-3 border-r group-focus-within:border-[#2DD4BF] group-focus-within:group-hover:border-[#2DD4BF] group-hover:border-[#0D9488] border-[#134E4A] items-center justify-center",
          {
            ["hidden"]: unit != "USD",
          }
        )}
      >
        $
      </div>
      <div className="flex w-full h-full items-center p-3 gap-2">
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => {
            onChange(new BigNumber(e.target.value));
          }}
          className="w-full h-full outline-none bg-transparent text-xs text-[#ADD7D4] focus:text-[#2DD4BF]"
        />
        <p className="text-xs">{unit}</p>
      </div>
    </div>
  );
}
