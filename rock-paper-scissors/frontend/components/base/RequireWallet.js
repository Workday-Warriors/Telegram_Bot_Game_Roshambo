"use client";

import { useUserProfileContext } from "@/lib/contexts/UserProfileProvider";
//import Button from "./Button";
import dynamic from "next/dynamic";
const Button = dynamic(() => import("./Button"), {ssr:false});
const Container = dynamic(() => import("./Container"), {ssr:false});
import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function RequireWallet({ title }) {
  const { setConnectedWallet } = useUserProfileContext();
  const { open } = useWeb3Modal();
  const onConnectWallet = () => {
    // setConnectedWallet(true);
    open();
  };
  return (
    <Container className={"w-full md:w-1/2 lg:w-1/2 xl:w-1/3"}>
      <div className="flex flex-col w-full h-fit p-4 items-center justify-center">
        <p className="text-xs text-[#779A98] mb-3 text-center">
          No wallet connected
        </p>
        <p className="text-xl font-bold text-white w-2/3 mb-6 text-center">
          {title}
        </p>
        <Button onClick={onConnectWallet} className={"px-6 py-2"}>
          Connect wallet
        </Button>
      </div>
    </Container>
  );
}
