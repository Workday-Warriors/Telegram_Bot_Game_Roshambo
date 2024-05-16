import { ADMIN_ADDRESS, STAKE_CONTRACT_ADDRESS, STAKE_TOKEN_ADDRESS } from "@/lib/const";
import {
  useContractWrite,
  usePrepareContractWrite,
  erc20ABI,
  useContractRead,
} from "wagmi";
import { ADMIN_WALLET_ADDRESS, CONTRACT_ADDRESS } from "@/cosntant/constant";

export function useApprove(amount) {
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: erc20ABI,
    functionName: "approve",
    args: [ADMIN_ADDRESS, amount],
  });

  return useContractWrite(config);
}

export function useTransfer(amount) {
    const { config } = usePrepareContractWrite({
      address: CONTRACT_ADDRESS,
      abi: erc20ABI,
      functionName: "transfer",
      args: [ADMIN_WALLET_ADDRESS, amount],
    });
  
    return useContractWrite(config);
  }