"use client";

import Image from "next/image";
import Button from "../Button";
import clsx from "clsx";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { DECEMAL_COUNT } from "@/lib/const";
import { useWithDraw } from "@/lib/contracts/wallet";
import { useWaitForTransaction } from "wagmi";
import { formatEther, parseEther } from "viem";

export default function UnstakeModal({ visible, stakedAmount, onClose }) {
  const [unStakeAmount, setUnstakeAmount] = useState(0);
  const [unStakingInputValue, setUnstakingInputValue] = useState("");
  const [txHash, setTxHash] = useState("");
  const [pending, setPending] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [warning, setWarning] = useState(false);
  const [success, setSuccess] = useState(false);

  const unStakeContract = useWithDraw(unStakeAmount);
  const txUnStakeWaitContract = useWaitForTransaction(txHash);

  const NumberFormatter = (number) => {
    const formattedNumber = new Intl.NumberFormat().format(
      isNaN(number) ? 0 : number
    );

    return formattedNumber;
  };

  const onUnstake = () => {
    if (pending || txPending) return;

    const formatedUnStakeAmount = parseInt(formatEther(unStakeAmount), 10);
    const formatedStakedAmount = parseInt(formatEther(stakedAmount ? stakedAmount : 0), 10);

    if (
      formatedUnStakeAmount > formatedStakedAmount || formatedUnStakeAmount < 0
    ) {
      setWarning(true);
      return;
    }
    unStakeContract.write();
  };

  useEffect(() => {
    const { data, status } = unStakeContract;
    if (status === "loading") setPending(true);
    else {
      if (status === "success") setTxHash(data);
      setPending(false);
    }
  }, [unStakeContract]);

  useEffect(() => {
    const { data, status } = txUnStakeWaitContract;
    if (status === "loading") setTxPending(true);
    else {
      if (status === "success" && txPending) {
        setSuccess(true);
        setUnstakingInputValue("");
        setUnstakeAmount(0);
      } else if (status != "success") setSuccess(false);
      setTxPending(false);
    }
  }, [txUnStakeWaitContract, txPending]);

  useEffect(() => {
    const formatedUnStakeAmount = parseInt(formatEther(unStakeAmount), 10);
    const formatedStakedAmount = parseInt(formatEther(stakedAmount ? stakedAmount : 0), 10);
    if (
      formatedUnStakeAmount <= formatedStakedAmount && formatedUnStakeAmount > 0
    )
      setWarning(false);
    else setWarning(true);
  }, [unStakeAmount, stakedAmount]);

  const closeModal = () => {
    setSuccess(false);
    setPending(false);
    onClose();
  };

  return (
    <div
      className={clsx(
        "fixed flex z-30 left-0 top-0 w-full h-full overflow-auto bg-[#000000aa] items-center justify-center px-4",
        {
          ["hidden"]: !visible,
        }
      )}
    >
      <div
        className="absolute w-full h-full backdrop-blur-sm cursor-pointer"
        onClick={closeModal}
      ></div>
      <div className="fixed flex flex-col w-11/12 h-[460px] bg-[#021718] border border-[#2DD4BF] items-center justify-between p-6 xl:w-[560px]">
        {txPending ? (
          <div class="flex flex-col justify-center items-center bg-transparent h-screen dark:invert gap-12">
            <div class="border-[#021718] h-32 w-32 animate-spin rounded-full border-8 border-t-[#2DD4BF] border-r-[#2DD4BF]" />
            <div className="flex gap-2">
              <span class="text-[#2DD4BF] text-2xl font-medium">
                Unstaking in progress
              </span>
              <div className="flex gap-1 items-end mb-1">
                <div class="h-2 w-2 bg-[#2DD4BF] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div class="h-2 w-2 bg-[#2DD4BF] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div class="h-2 w-2 bg-[#2DD4BF] rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        ) : success ? (
          <>
            <div className="flex flex-col w-full h-full items-center justify-center">
              <div class="success-animation">
                <svg
                  className="w-24 h-24 rounded-full block border-2 border-[#2DD4BF] stroke-2 stroke-[#2DD4BF] stroke-miterlimit-10 shadow-inner-green relative mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    class="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    class="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
              <p className="text-[#2DD4BF] text-2xl mt-4">Success!</p>
            </div>
            <div className="flex flex-col w-full md:flex-row justify-center">
              <Button className={"px-20 py-2"} onClick={closeModal}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-center gap-11">
              <p className="text-xl text-white font-bold w-full text-left">
                Unstake DGI
              </p>
              <div className="flex flex-col w-full gap-1">
                <div className="flex bg-[#021E1F] border border-[#134E4A] items-center px-3 py-2 gap-8">
                  <div className="flex gap-4 items-center">
                    <Image
                      src={"/token/dgi.svg"}
                      width="18"
                      height="35"
                      alt="token"
                    />
                    <p className="text-[#ADD7D4] font-bold">DGI</p>
                  </div>
                  <input
                    type="text"
                    placeholder="0"
                    value={unStakingInputValue}
                    onChange={(e) => {
                      setUnstakingInputValue(e.target.value);
                      const amount = new BigNumber(e.target.value).times(
                        new BigNumber(10).pow(DECEMAL_COUNT)
                      );
                      setUnstakeAmount(amount);
                    }}
                    className="w-full outline-none bg-transparent text-[#ADD7D4CC] text-2xl"
                  />
                  <div
                    className="flex h-fit bg-[#093A37] border border-[#093A37] rounded-[4px] items-center cursor-pointer px-2 py-1"
                    onClick={() => {
                      if (pending || txPending) return;
                      // const amount = formatEther(stakedAmount)
                      const amount = new BigNumber(stakedAmount).dividedBy(
                        new BigNumber(10).pow(DECEMAL_COUNT)
                      );
                      setUnstakingInputValue(amount);
                      setUnstakeAmount(stakedAmount);
                    }}
                  >
                    <p className="text-xs text-[#ADD7D4]">MAX</p>
                  </div>
                </div>
                <div className="flex">
                  {/* {warning && (
                <p className="text-[10px] text-[#e06e4b] w-full text-left">
                  Please input the amount correctly
                </p>
              )} */}
                  <p className="text-[9px] text-[#779A98] w-full text-right">
                    Currently staked:{" "}
                    {NumberFormatter(
                      new BigNumber(stakedAmount).dividedBy(
                        new BigNumber(10).pow(DECEMAL_COUNT)
                      )
                    )}{" "}
                    DGI
                  </p>
                </div>
              </div>
            </div>

            <Button
              className={"px-20 py-2"}
              disabled={warning}
              onClick={onUnstake}
            >
              {pending || txPending ? (
                <p className="flex justify-center items-center">
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-6 h-6 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                </p>
              ) : (
                "Unstake"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
