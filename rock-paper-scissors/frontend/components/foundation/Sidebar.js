"use client";

import Image from "next/image";
import MenuItem from "../base/MenuItem";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import clsx from "clsx";
import { useUserProfileContext } from "@/lib/contexts/UserProfileProvider";

export default function Sidebar({ onClickMenu, onClose, visible }) {
  const { route } = useUserProfileContext();
  const onClick = (title) => {
    onClickMenu(title);
    onClose();
  };
  const onClickSwap = () => {
    window.open(
      "https://app.uniswap.org/swap?chain=mainnet&outputCurrency=0xE453C3409f8Ad2B1FE1ED08E189634d359705A5B&inputCurrency=ETH",
      "_blank"
    );
    onClose();
  };
  const onClickAudit = () => {
    window.open(
      "https://www.rdauditors.com/wp-content/uploads/2024/02/DGI-Game-Smart-Contract-Security-Report-12_2_24.pdf",
      "_blank"
    );
    onClose();
  };

  return (
    <div
      className={clsx(
        "fixed flex-col flex-none left-0 right-0 w-0 h-screen border-r border-border-color backdrop-blur-lg gap-6 xl:pt-14 z-30 xl:w-[242px] xl:bg-transparent xl:static xl:flex overflow-hidden",
        {
          ["w-0"]: !visible,
          ["w-full lg:w-1/3"]: visible,
        }
      )}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="absolute w-full h-full bg-black opacity-75 -z-10 xl:hidden"></div>
      <div
        id="menu header"
        className={
          "flex w-full justify-between border-border-color border-b mb-6 relative xl:hidden"
        }
      >
        <div
          id="h-logo"
          className="flex w-full h-[88px] gap-3 p-4 items-center lg:px-10"
        >
          <Image src={"/logo.svg"} width="27" height="54" alt="logo ico" />
          <Image
            src={"/logo-title.svg"}
            width="122"
            height="29"
            alt="logo title"
          />
        </div>
        <div
          className="absolute flex w-full h-full justify-end items-center pr-4 cursor-pointer"
          onClick={onClose}
        >
          <AiOutlineClose className="text-[#2DD4BF] text-3xl" />
        </div>
      </div>
      <MenuItem
        title="console"
        active={route === "console"}
        onClick={onClick}
      />
      <MenuItem
        title="calculator"
        active={route === "calculator"}
        onClick={onClick}
      />
      <MenuItem title="stake" active={route === "stake"} onClick={onClick} />
      <MenuItem title="swap" onClick={onClickSwap} />
      <MenuItem title="audit" onClick={onClickAudit} />
    </div>
  );
}
