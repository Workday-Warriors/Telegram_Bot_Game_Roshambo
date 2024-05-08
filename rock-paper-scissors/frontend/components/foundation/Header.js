"use client";

import Image from "next/image";
import Button from "../base/Button";
import { useUserProfileContext } from "@/lib/contexts/UserProfileProvider";
import clsx from "clsx";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import axios from "axios"
import { useEffect } from "react";

export default function Header({ onClickMenu }) {
  const { connectedWallet, setConnectedWallet } = useUserProfileContext();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { open } = useWeb3Modal();
  const onConnectWallet = () => {
    open();
    // setConnectedWallet(true);
  };
  const readableAddress = (addr) => {
    return `${addr.slice(0, 8)}...${addr.slice(addr.length - 4)}`;
  };

  const showProfile = () => {
    if (!address) //before wallet connect
      return (
        <div
          className={"flex w-full h-full mx-4 gap-2 lg:mx-12 md:gap-4 xl:gap-8"}
        >
          <Button onClick={onConnectWallet}>
            <Image
              src={"/wallet-ico.svg"}
              width="32"
              height="32"
              alt="wallet ico"
            />
            <p className="hidden lg:flex">Connect wallet</p>
          </Button>
          <div className="flex cursor-pointer xl:hidden" onClick={onClickMenu}>
            <Image
              src={"/menu-ico.svg"}
              width="32"
              height="32"
              alt="menu ico"
            />
          </div>
        </div>
      );
    else // after wallet connect
      return (
        // right part
        <div
          className={
            "flex w-full h-full items-center gap-2 mx-4 md:gap-4 xl:gap-8 lg:mx-12"
          }
        >
          {/* alarm */}
          <div className="flex w-fit h-full rounded-md bg-[#032E31] cursor-pointer p-2 xl:rounded-sm">
            <Image
              src={"/alarm.svg"}
              width="32"
              height="32"
              alt="notification"
            />
          </div>
          {/* wallet account */}
          <div className="flex w-fit h-full rounded-sm bg-transparent items-center cursor-pointer p-2 gap-2 md:gap-4 lg:bg-[#032E31]">
            <p className="hidden text-sm font-medium text-[#ADD7D4] lg:flex">
              {readableAddress(address ? address : "")}
            </p>
            <div className="flex w-auto h-auto">
              <Image src={"/avatar.svg"} alt="avatar" width="42" height="42" />
            </div>
          </div>
          <div className="flex cursor-pointer xl:hidden" onClick={onClickMenu}>
            <Image
              src={"/menu-ico.svg"}
              width="32"
              height="32"
              alt="menu ico"
            />
          </div>
        </div>
      );
  };
  return (
    <div className="flex w-full h-[88px] border-b border-border-color items-center justify-between">
      <div className="flex w-fit h-full">
        <div
          id="h-logo"
          className="flex w-fit h-full gap-3 p-4 border-border-color justify-center items-center lg:w-[242px] lg:px-10 lg:border-r"
        >
          <Image src={"/logo.svg"} width="27" height="54" alt="logo ico" />
          <Image
            src={"/logo-title.svg"}
            width="122"
            height="29"
            alt="logo title"
          />
        </div>
      </div>
      <div className="flex w-fit h-12">{showProfile()}</div>
    </div>
  );
}
