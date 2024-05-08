"use client";

import clsx from "clsx";
import Image from "next/image";

export default function MenuItem({ title, active, onClick }) {
  return (
    <div
      className="flex w-full h-fit relative cursor-pointer group"
      onClick={() => onClick(title)}
    >
      <div
        className={clsx(
          "flex w-full h-fit  border items-center mx-4 px-4 py-2 gap-6",
          {
            ["border-transparent group-active:border-[#134E4A] group-hover:bg-[#092D2A] bg-transparent"]:
              !active,
            ["border-primary-light bg-[#093A37]"]: active,
          }
        )}
      >
        <Image
          src={`/${title}-${active ? "active-" : ""}ico.${
            title === "audit" ? "png" : "svg"
          }`}
          width="32"
          height="32"
          alt="menu ico"
        />
        <p
          className={clsx("text-white", {
            ["text-[#779A98]"]: !active,
          })}
        >
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </p>
      </div>
      <div
        className={clsx(
          "absolute w-[10px] h-full bg-[#093A37] border border-l-0 border-primary-light",
          {
            ["hidden"]: !active,
          }
        )}
      ></div>
    </div>
  );
}
