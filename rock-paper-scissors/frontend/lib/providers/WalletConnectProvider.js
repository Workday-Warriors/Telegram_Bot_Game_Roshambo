"use client";

import { Inter } from "next/font/google";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { mainnet, sepolia } from "viem/chains";
import { PROJECT_ID } from "../const";

// 1. Get projectId
const projectId = PROJECT_ID;

// 2. Create wagmiConfig
const metadata = {
  name: "DGI",
  description: "DGI Staking Dashboard",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, sepolia];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
const inter = Inter({ subsets: ["latin"] });

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeVariables: {
    "--w3m-font-family": inter.style.fontFamily,
    "--w3m-border-radius-master": "2px",
  },
});

export default function WalletConnectProvider({ children }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
