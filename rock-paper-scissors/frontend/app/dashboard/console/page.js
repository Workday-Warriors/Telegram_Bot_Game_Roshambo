"use client";

import { Container } from "@/components/base/Container";
import RequireWallet from "@/components/base/RequireWallet";
import { useUserProfileContext } from "@/lib/contexts/UserProfileProvider";
// import clsx from "clsx";
// import dynamic from "next/dynamic";
// import Image from "next/image";
import { useEffect, useState } from "react";
import { useDebounce } from 'use-debounce';
import { configureChains, createClient, WagmiConfig, useAccount, useContract,
  useSignMessage
} from "wagmi";
import { parseEther } from 'viem';
import BigNumber from "bignumber.js";
import { useGetStakeInfo } from "@/lib/graphql/useGetStakeInfo";
import { ADMIN_ADDRESS, DECEMAL_COUNT } from "@/lib/const";
import { GoDatabase } from "react-icons/go";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { useGetTotalStakedAmount } from "@/lib/contracts/wallet";
import Button from "@/components/base/Button";
import Room from "@/components/base/Room";
import { useRouter } from "next/navigation";

import { getRooms, createRoom, registerUser, getUser, updateUser, gameTokenBuy, gameTokenGet } from "@/api/api";
import { CONTRACT_ADDRESS } from "@/cosntant/constant";
export default function Console() {
  const { address, isConnecting, isDisconnected } = useAccount();

  const [game_rockTokenValue, setGameRockToken] = useState(0);
  const [game_scissorsTokenValue, setGameScissorsToken] = useState(0);
  const [game_paperTokenValue, setGamePaperToken] = useState(0);

  const [set_game_rockTokenValue, setSetedGameRockToken] = useState(0);
  const [set_game_scissorsTokenValue, setSetedGameScissorsToken] = useState(0);
  const [set_game_paperTokenValue, setSetedGamePaperToken] = useState(0);

  const [lstRoom, setLstRoom] = useState([]);

  const { route, setRoute } = useUserProfileContext();
  const router = useRouter();

  ///////////////////////////////////////////////////////
  //transaction
  // const [ debouncedTo ] = useDebounce(ADMIN_ADDRESS, 500);
  // const [amount, setAmount] = useState('');
  // const [debounceAmount] = useDebounce(amount, 500);

  // const {config} = usePrepareSendTransaction({
  //   to: debouncedTo,
  //   value: debounceAmount ? parseEther(debounceAmount) : undefined,
  // });

  // const { data, sendTransaction } = useSendTransaction(config);

  // const {isLoading, isSuccess} = useWaitForTransaction({
  //   hash: data?.hash,
  // });

  const erc20ABI = [
    "function transfer(address to, uint amount) returns (bool)"
  ];
  
  // Component for sending ERC-20 tokens
  const SendERC20Token = () => {
    const { isConnected } = useAccount();
    const { data: signer } = useSignMessage();
    const tokenAddress = CONTRACT_ADDRESS;
  
    // Create a contract instance
    const tokenContract = useContract({
      addressOrName: tokenAddress,
      contractInterface: erc20ABI,
      signerOrProvider: signer,
    });
  
    const handleSendToken = async () => {
      if (!isConnected) {
        console.log('You must connect a wallet first!');
        return;
      }
  
      try {
        const recipientAddress = '0xRecipientAddress'; // Replace with the recipient's address
        const amount = ethers.utils.parseUnits('100', 18); // Adjust the '100' and '18' based on the amount and decimals of the token
  
        const tx = await tokenContract.transfer(recipientAddress, amount);
        const receipt = await tx.wait();
        console.log('Token transfer successful:', receipt);
      } catch (error) {
        console.error('Token transfer failed:', error);
      }
    };
  //
  ///////////////////////////////////////////////////////////

  const commonGetRooms = async () => {
    getRooms()
    .then(data => {
      if(data.successMessage == 0) {
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
    registerUser(address, 20)
    .then(data => {
      if(data.successMessage == 0) {
        commonGetRooms();
      }
    })
    .catch(error => console.error('registerUser Error:', error));
  };

  const commonUpdateUser = async () => {
    updateUser(address, 30)
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
        router.push(`/game/room/` + _room);
      }
    })
    .catch(error => console.error('gameTokenBuy Error:', error));
  };
  
  const commonGameTokenGet = async (_room) => {
    gameTokenGet(address, _room)
    .then(data => {
      if(data.successMessage == 0) {
        
        if(data.result[0].roomId == _room) {
          alert("You can't buy the new tokens because you did buy already!!!");
          setSetedGameRockToken(0);
          setSetedGameScissorsToken(0);
          setSetedGamePaperToken(0);
        } else {
          commonGameTokenBuy(set_game_rockTokenValue, set_game_scissorsTokenValue, set_game_paperTokenValue, _room);
        }
      }
    })
    .catch(error => console.error('gameTokenGet Error:', error));
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      if(address) {
        commonGetUser();
        return;
      }
    }, 1000);

    return () => {
        clearInterval(intervalId); // Cleanup function to clear the interval     
    };
  });

  const formatTokenPrice = (price) => {
    const convertedNumber = parseFloat(price).toString();
    const result = convertedNumber.match(/^-?\d+(?:\.\d{0,6})?/)[0];

    return result;
  };

  const NumberFormatter = (number) => {
    const formattedNumber = new Intl.NumberFormat().format(
      isNaN(number) ? 0 : number
    );
    return formattedNumber;
  };

  return (
    <div className="flex flex-col w-full h-full gap-4 sm:gap-8 xl:gap-12 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="flex lg:hidden">
        <p className="font-bold text-white">Console</p>
      </div>
      <div className="w-full h-fit gap-4 sm:gap-8 xl:gap-12 lg:flex-row xl:flex-row">
        {address ? (
          <>
            <Container className={"w-full"}>
              {address == ADMIN_ADDRESS ? (
                <div className="flex w-full h-full gap-4 p-4 relative justify-center">
                <Button onClick={() => {commonCreateRoom();}}>
                  Create a room
                </Button>
              </div>
              ) : ('')}
              <div className="flex gap-4 p-4 relative">
                {lstRoom.map((item, key) => (
                  <Room 
                  roomName={item.id} 
                  onClick={() => {
                    if((parseInt(set_game_rockTokenValue) + parseInt(set_game_scissorsTokenValue) + parseInt(set_game_paperTokenValue)) == 0) {
                      alert("Input the game token count for one game");
                      return;
                    }

                    if((parseInt(set_game_rockTokenValue) + parseInt(set_game_scissorsTokenValue) + parseInt(set_game_paperTokenValue)) > 10) {
                      alert("The specific token count is overflowed for one game");
                      return;
                    }
                    commonGameTokenGet(item.id);
                  }} />
                ))
                }
              </div>
            </Container>
            {/* <div className="flex mt-4 p-2">
              <div className="bg-[#032E31] w-2/3 mx-auto rounded-lg p-2 pt-10">
                <div className="text-center text-[#779A98] text-3xl">WALLET INFORMATION</div>
                <div className="flex mt-2">
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">ERC-20 TOKEN (RSP)</label>
                  <input type="number" className="w-1/3 ml-2 text-center"
                    value={rspTokenValue}
                    onChange={(e) => {
                      setRSPToken(e.target.value);
                    }}
                  />
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">{remain_rspTokenValue}</label>
                </div>
                <div className="flex mt-2">
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">NFT TOKEN (ROCK)</label>
                  <input id="rockToken" type="number" className="w-1/3 ml-2 text-center"
                    value={rockTokenValue}
                    onChange={(e) => {
                      setRockToken(e.target.value);
                    }}
                  />
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">{remain_rockTokenValue}</label>
                </div>
                <div className="flex mt-2">
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">NFT TOKEN (SCISSORS)</label>
                  <input type="number" className="w-1/3 ml-2 text-center"
                  value={scissorsTokenValue}
                  onChange={(e) => {
                    setScissorsToken(e.target.value);
                  }}
                  />
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">{remain_scissorsTokenValue}</label>
                </div>
                <div className="flex mt-2">
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">NFT TOKEN (PAPER)</label>
                  <input type="number" className="w-1/3 ml-2 text-center"
                    value={paperTokenValue}
                    onChange={(e) => {
                      setPaperToken(e.target.value);
                    }}
                  />
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">{remain_paperTokenValue}</label>
                </div>
                <div className="flex w-full mt-2 gap-4 p-4 relative justify-center">
                  <Button onClick={() => {
                    setRSPTokenAll(parseInt(rspTokenValue) + parseInt(remain_rspTokenValue));
                    setRockTokenAll(parseInt(rockTokenValue) + parseInt(remain_rockTokenValue));
                    setScissorsTokenAll(parseInt(scissorsTokenValue) + parseInt(remain_scissorsTokenValue));
                    setPaperTokenAll(parseInt(paperTokenValue) + parseInt(remain_paperTokenValue));
                    alert("Successfull!");
                  }}>TOKEN BUY</Button>
                </div>
              </div>
            </div> */}

            <div className="flex mt-4 p-2">
              <div className="bg-[#032E31] w-2/3 mx-auto rounded-lg p-2 pt-10">
                <div className="text-center text-[#779A98] text-3xl">GAME TOKEN</div>
                <div className="flex mt-2">
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">NFT TOKEN (ROCK)</label>
                  <input id="rockToken" type="number" className="w-1/3 ml-2 text-center"
                    value={game_rockTokenValue}
                    onChange={(e) => {
                      setGameRockToken(e.target.value);
                    }}
                  />
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">{set_game_rockTokenValue}</label>
                </div>
                <div className="flex mt-2">
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">NFT TOKEN (SCISSORS)</label>
                  <input type="number" className="w-1/3 ml-2 text-center"
                  value={game_scissorsTokenValue}
                  onChange={(e) => {
                    setGameScissorsToken(e.target.value);
                  }}
                  />
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">{set_game_scissorsTokenValue}</label>
                </div>
                <div className="flex mt-2">
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">NFT TOKEN (PAPER)</label>
                  <input type="number" className="w-1/3 ml-2 text-center"
                    value={game_paperTokenValue}
                    onChange={(e) => {
                      setGamePaperToken(e.target.value);
                    }}
                  />
                  <label className="w-1/3 text-center text-[#779A98] text-2xl">{set_game_paperTokenValue}</label>
                </div>
                <div className="flex w-full mt-2 gap-4 p-4 relative justify-center">
                  <Button onClick={() => {
                    // if(parseInt(game_rockTokenValue) > parseInt(remain_rockTokenValue)) {
                    //   alert("The rock token count overflow");
                    //   return;
                    // }
                    // if(parseInt(game_scissorsTokenValue) > parseInt(remain_scissorsTokenValue)) {
                    //   alert("The rock token count overflow");
                    //   return;
                    // }

                    // if(parseInt(game_paperTokenValue) > parseInt(remain_paperTokenValue)) {
                    //   alert("The rock token count overflow");
                    //   return;
                    // }

                    if((parseInt(game_rockTokenValue) + parseInt(game_scissorsTokenValue) + parseInt(game_paperTokenValue)) == 0) {
                      alert("Input the game token count for one game");
                      return;
                    }

                    if((parseInt(game_rockTokenValue) + parseInt(game_scissorsTokenValue) + parseInt(game_paperTokenValue)) > 10) {
                      alert("The game token count is overflowed for one game");
                      return;
                    }

                    setSetedGameRockToken(game_rockTokenValue);
                    setSetedGameScissorsToken(game_scissorsTokenValue);
                    setSetedGamePaperToken(game_paperTokenValue);
                    const total = set_game_paperTokenValue + set_game_rockTokenValue + set_game_scissorsTokenValue;
                    setAmount(total.toString());
                    // setRockTokenAll(parseInt(remain_rockTokenValue) - parseInt(game_rockTokenValue));
                    // setScissorsTokenAll(parseInt(remain_scissorsTokenValue) - parseInt(game_scissorsTokenValue));
                    // setPaperTokenAll(parseInt(remain_paperTokenValue) - parseInt(game_paperTokenValue));
                  }}>GAME TOKEN SET</Button>
                  <Button
                    disabled={isLoading || !sendTransaction || !amount}
                    onClick={(e) => {
                      e.preventDefault();
                      alert("hello");
                      sendTransaction?.();
                    }}
                  >{isLoading ? 'Sending' : 'Send'}</Button>
                  {isSuccess && (
                    <a className="text-white p-4" href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <RequireWallet title={"Connect a wallet to see your DGI totals"} />
        )}
      </div>
    </div>
  );
}
