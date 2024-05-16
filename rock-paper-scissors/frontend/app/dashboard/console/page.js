"use client";

import RequireWallet from "@/components/base/RequireWallet";
import { useEffect, useState } from "react";
import {
  useAccount, useBalance, useWaitForTransaction
} from "wagmi";
import dynamic from "next/dynamic";
const Button = dynamic(() => import("@/components/base/Button"), {ssr:false,
  loading: () => <p>Loading...</p>,
  onError: (error) => {
  console.error(error);
  return <p>Failed to load the Button component.</p>;
},});
const Container = dynamic(() => import("@/components/base/Container"), {ssr:false});
import Room from "@/components/base/Room";
import { useRouter } from "next/navigation";

import { getRooms, createRoom, registerUser, getUser, updateUser, gameTokenBuy, gameTokenGet, gameTokenUpdate } from "@/api/api";
import { ADMIN_WALLET_ADDRESS, CONTRACT_ADDRESS } from "@/cosntant/constant";
import { useTransfer } from "@/utils/wallet";
export default function Console() {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    token: CONTRACT_ADDRESS,
  });

  const [game_rockTokenValue, setGameRockToken] = useState(0);
  const [game_scissorsTokenValue, setGameScissorsToken] = useState(0);
  const [game_paperTokenValue, setGamePaperToken] = useState(0);

  const [set_game_rockTokenValue, setSetedGameRockToken] = useState(0);
  const [set_game_scissorsTokenValue, setSetedGameScissorsToken] = useState(0);
  const [set_game_paperTokenValue, setSetedGamePaperToken] = useState(0);
  const [transferPending, setTransferPending] = useState(false);
  const [txTransferPending, setTxTransferPending] = useState(false);
  const [txTransferHash, setTxTransferHash] = useState("");
  const txTransferWaitContract = useWaitForTransaction(txTransferHash);

  const [success, setSuccess] = useState(false);

  const [lstRoom, setLstRoom] = useState([]);

  const router = useRouter();

  const [amount, setAmount] = useState(0);

  const transferContract = useTransfer(amount);

  const formatAmount = (amount) => {
    const convertedNumber = parseFloat(amount).toString();
    const result = convertedNumber.match(/^-?\d+(?:\.\d{0,6})?/)[0];

    return result;
  };

  const commonGetRooms = async () => {
    getRooms()
    .then(data => {
      if(data.successMessage == 0) {
        console.log(data.result);
        setLstRoom(data.result);
      }
    })
    .catch(error => console.error('getGameTokenByAddress Error:', error));
  };

  const commonCreateRoom = async () => {
    createRoom(address)
    .then(data => {
      if(data.successMessage == 0) {
        commonGetRooms();
      }
    })
    .catch(error => console.error('getGameTokenByAddress Error:', error));
  };

  const commonRegisterUser = async () => {
    registerUser(address, balance.formatted)
    .then(data => {
      if(data.successMessage == 0) {
        commonGetRooms();
      }
    })
    .catch(error => console.error('registerUser Error:', error));
  };

  const commonUpdateUser = async () => {
    updateUser(address, balance.formatted)
    .then(data => {
      if(data.successMessage == 0) {
        commonGetRooms();
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

  const commonGameTokenBuy = async (_rock, _scissors, _paper, _room) => {
    gameTokenBuy(_rock, _scissors, _paper, address, _room)
    .then(data => {
      if(data.successMessage == 0) {
      }
    })
    .catch(error => console.error('gameTokenBuy Error:', error));
  };

  const commonGameTokenUpdate = async (_room) => {
    gameTokenUpdate(address, _room)
    .then(data => {
      if(data.successMessage == 0) {
        commonGameTokenGet(_room);
      }
    })
    .catch(error => console.error(`gameTokenUpdate Error:`, error));
  }
  
  const commonGameTokenGet = async (_room) => {
    console.log(address, _room);
    gameTokenGet(address, _room)
    .then(data => {
      if(data.successMessage == 0) {
        if(data.result[0].roomId == _room) {
          // if(data.result[0].rock == 0 & data.result[0].scissors == 0 & data.result[0].paper == 0) {
          //   alert("You ")
          // }
          
          setSetedGameRockToken(0);
          setSetedGameScissorsToken(0);
          setSetedGamePaperToken(0);
        }
      } else {
        commonGameTokenUpdate(_room);
      }
    })
    .catch(error => console.error('gameTokenGet Error:', error));
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      if(address) {
//        commonGetUser();
        commonGetRooms();
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
        commonGameTokenBuy(set_game_rockTokenValue, set_game_scissorsTokenValue, set_game_paperTokenValue, 0);
        setAmount(0);
        setGameRockToken(0);
        setGameScissorsToken(0);
        setGamePaperToken(0);

        console.log(txTransferHash);
      } else if (status != "success") setSuccess(false);
      setTxTransferPending(false);
    }
  }, [txTransferWaitContract, txTransferPending]);

  return (
    <div className="flex flex-col w-full h-full gap-4 sm:gap-8 xl:gap-12 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="flex lg:hidden">
        <p className="font-bold text-white">Console</p>
      </div>
      <div className="w-full h-fit gap-4 sm:gap-8 xl:gap-12 lg:flex-row xl:flex-row">
        {address ? (
          <>
            <Container className={"w-full"}>
              {address == ADMIN_WALLET_ADDRESS ? (
                <div className="flex w-full h-full gap-4 p-4 relative justify-center">
                <Button onClick={() => {commonCreateRoom();}}>
                  Create a room
                </Button>
              </div>
              ) : ('')}
              <div className="flex gap-4 p-4 relative">
                {lstRoom.length ? lstRoom.map((item, key) => (
                  <Room 
                  key={key}
                  roomName={item.id} 
                  onClick={() => {
                    router.push('/game/request/' + item.id);
                  }} />
                )): 'There is no opening room now. Please wait.'
                }
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
