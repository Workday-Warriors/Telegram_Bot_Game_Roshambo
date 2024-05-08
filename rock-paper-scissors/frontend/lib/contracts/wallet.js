import { STAKE_CONTRACT_ADDRESS, STAKE_TOKEN_ADDRESS } from "@/lib/const";
import {
  useContractWrite,
  usePrepareContractWrite,
  erc20ABI,
  useContractRead,
} from "wagmi";
import abi from "./staking.abi.json";

export function useGetAllowance(address) {
  const contractRead = useContractRead({
    address: STAKE_TOKEN_ADDRESS,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, STAKE_CONTRACT_ADDRESS],
  });

  return contractRead;
}

export function useApprove(amount) {
  const { config } = usePrepareContractWrite({
    address: STAKE_TOKEN_ADDRESS,
    abi: erc20ABI,
    functionName: "approve",
    args: [STAKE_CONTRACT_ADDRESS, amount],
  });

  return useContractWrite(config);
}

export function useGetReward(address) {
  const contractRead = useContractRead({
    address: STAKE_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "earned",
    args: [address],
  });

  return contractRead;
}

export function useClaimReward() {
  const { config } = usePrepareContractWrite({
    address: STAKE_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "getReward",
  });

  return useContractWrite(config);
}

export function useStartStake(amount) {
  const { config } = usePrepareContractWrite({
    address: STAKE_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "stake",
    args: [amount],
  });

  return useContractWrite(config);
}

export function useWithDraw(amount) {
  const { config } = usePrepareContractWrite({
    address: STAKE_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "withdraw",
    args: [amount],
  });

  return useContractWrite(config);
}

export function useGetTotalStakedAmount() {
  const contractRead = useContractRead({
    address: STAKE_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "totalSupply",
  });

  return contractRead;
}
