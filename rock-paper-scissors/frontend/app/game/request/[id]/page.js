"use client";

import RequireWallet from "@/components/base/RequireWallet";
import { useEffect, useState } from "react";
import {
  useAccount, useBalance, useWaitForTransaction
} from "wagmi";
import { parseEther } from 'viem';
//import Button from "@/components/base/Button";
import dynamic from "next/dynamic";
const Button = dynamic(() => import("@/components/base/Button"), {ssr:false});
const Container = dynamic(() => import("@/components/base/Container"), {ssr:false});
import { useRouter } from "next/navigation";

import { getRooms, createRoom, registerUser, getUser, updateUser, gameTokenBuy, gameTokenGet, checkRoomStatus } from "@/api/api";
import { ADMIN_WALLET_ADDRESS, CONTRACT_ADDRESS } from "@/cosntant/constant";
import { useTransfer } from "@/utils/wallet";
export default function requestGame({params: {id}}) {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    token: CONTRACT_ADDRESS,
  });

  const [inputSticker, setInputSticker] = useState(0);

  const [gameSticker, setGameSticker] = useState(0);

  const [transferPending, setTransferPending] = useState(false);
  const [txTransferPending, setTxTransferPending] = useState(false);
  const [txTransferHash, setTxTransferHash] = useState("");
  const txTransferWaitContract = useWaitForTransaction(txTransferHash);

  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const [amount, setAmount] = useState(0);

  const transferContract = useTransfer(amount);

  const formatAmount = (amount) => {
    const convertedNumber = parseFloat(amount).toString();
    const result = convertedNumber.match(/^-?\d+(?:\.\d{0,6})?/)[0];

    return result;
  };

  const commonUpdateUser = async () => {
    updateUser(address, balance.formatted)
    .then(data => {
      if(data.successMessage == 0) {
      }
    })
    .catch(error => console.error('updateUser Error:', error));
  };

  const commonGetUser = async () => {
    getUser(address)
    .then(data => {
      if(data.successMessage == 0) {
        if(data.result[0].walletAddress == address)
          commonUpdateUser();
        else
          commonRegisterUser();
      } else if (data.successMessage == 1) {
        commonRegisterUser();
      }
    })
    .catch(error => console.error('getUser Error:', error));
  };

  const commonGameTokenBuy = async (_sticker, _room) => {
    gameTokenBuy(_sticker, address, _room)
    .then(data => {
      if(data.successMessage == 0) {
      }
    })
    .catch(error => console.error('gameTokenBuy Error:', error));
  };
  
  const commonGameTokenGet = async (_room) => {
    console.log(address, _room);
    gameTokenGet(address, _room)
    .then(data => {
      if(data.successMessage == 0) {
        if(data.result[0].roomId == _room) {
          router.push('/game/room/' + _room);
          setGameSticker(0);
        }
      }
    })
    .catch(error => console.error('gameTokenGet Error:', error));
  };

  const commonCheckRoomStatus = async () => {
    console.log(id);
    checkRoomStatus(id)
    .then(data => {
      console.log(data);
      if(data.successMessage == 0) {
        console.log(data.result[0]);
        if(data.result[0].finished == 0) {
          commonGameTokenGet(id);
        } else {
          console.log("hello");
          router.push('/');
        }
      } else {
        console.log("hi");
        router.push('/');
      }
    })
    .catch(error => console.error('CheckRoomStatus Error:', error));
  };
  
  useEffect(() => {
    commonCheckRoomStatus();
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      commonCheckRoomStatus();
      if(address) {
        //commonGetUser();
        return;
      }
    }, 1000);

    return () => {
        clearInterval(intervalId); // Cleanup function to clear the interval     
    };
  }, []);

  useEffect(() => {
    const { data, status } = transferContract;
    if (status === "loading") setTransferPending(true);
    else {
      if (status === "success") setTxTransferHash(data);
      setTransferPending(false);
    }
  }, [transferContract]);

  useEffect(() => {
    const { status } = txTransferWaitContract;
    if (status === "loading") setTxTransferPending(true);
    else {
      if (status === "success" && txTransferPending) {
        setSuccess(true);
        commonGameTokenBuy(gameSticker, id);
        setAmount(0);
        setGameSticker(0);

        console.log(txTransferHash);
      } else if (status != "success") setSuccess(false);
      setTxTransferPending(false);
    }
  }, [txTransferWaitContract, txTransferPending]);

  return (
    <div className="flex flex-col w-full h-full gap-4 sm:gap-8 xl:gap-12 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="w-full h-fit gap-4 sm:gap-8 xl:gap-12 lg:flex-row xl:flex-row">
        {address ? (
          <>
            <Container className={"w-full"}>
              <div className="flex mt-4 p-2">
                <div className="bg-[#032E31] w-2/3 mx-auto rounded-lg p-2 pt-10">
                  <div className="text-center text-[#779A98] text-3xl">GAME TOKEN(DJEN Balance: {formatAmount(balance ? balance.formatted : "0")})</div>
                  <div className="flex mt-2">
                    <label className="w-1/3 text-center text-[#779A98] text-2xl">STICKERS</label>
                    <input id="sticker" type="number" className="w-1/3 ml-2 text-center"
                      value={inputSticker}
                      onChange={(e) => {
                        setInputSticker(e.target.value);
                      }}
                    />
                    <label className="w-1/3 text-center text-[#779A98] text-2xl">{gameSticker}</label>
                  </div>
                  <div className="flex w-full mt-2 gap-4 p-4 relative justify-center">
                    <Button onClick={() => {
                      if(parseInt(inputSticker) == 0) {
                        alert("Input the game token count for one game");
                        return;
                      }

                      if(parseInt(inputSticker) > 10) {
                        alert("The game token count is overflowed for one game");
                        return;
                      }

                      if(parseInt(inputSticker) * 100 > parseInt(formatAmount(balance ? balance.formatted : "0"))) {
                        alert("Your balance is not enough.");
                        return;
                      }

                      setGameSticker(inputSticker);
                      const total = parseInt(inputSticker) * 100;
                      setAmount(parseEther(formatAmount(`${total}`)));
                    }}>GAME TOKEN SET</Button>
                    <Button
                      disabled={transferPending || txTransferPending || !amount}
                      onClick={(e) => {
                        e.preventDefault();
                        transferContract.write();
                      }}
                    >{transferPending || txTransferPending ? 'Sending' : 'Send'}</Button>
                    {success ? (<a className="text-white" href={`https://sepolia.etherscan.io/tx/${txTransferHash?.hash}`}>{txTransferHash?.hash}</a>) : ""}
                  </div>
                  {/* <div>
                    <video controls>
                      <srouce src={"/image/stickers/sticker0.webm"} type="video/webm"></srouce>
                    </video>
                  </div> */}
                </div>
              </div>
            </Container>
          </>
        ) : (
          <RequireWallet title={"Connect a wallet"} />
        )}
      </div>
    </div>
  );
}
