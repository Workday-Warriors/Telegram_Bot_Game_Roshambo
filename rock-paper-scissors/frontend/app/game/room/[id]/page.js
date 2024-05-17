"use client";

import Image from "next/image";
import RequireWallet from "@/components/base/RequireWallet";
import { useUserProfileContext } from "@/lib/contexts/UserProfileProvider";
import { useAccount } from "wagmi";
//import Button from "@/components/base/Button";
import dynamic from "next/dynamic";
const Button = dynamic(() => import("@/components/base/Button"), {ssr:false});
const Container = dynamic(() => import("@/components/base/Container"), {ssr:false});
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMessagesByRoomId, checkRoomStatus, sendMessageByRoomId, getGameTokenByAddress, finishGameByWinner } from "@/api/api";
import { ADMIN_WALLET_ADDRESS, REMAIN_BASIC_TIMER, REMAIN_MIDDLE_TIMER, REMAIN_HIGH_TIMER, TOKEN_MIDDLE_COUNT, TOKEN_HIGH_COUNT } from "@/cosntant/constant";

export default function GameRoom({params: {id}}) {
  const { address, isConnecting, isDisconnected } = useAccount();

  const { route, setRoute } = useUserProfileContext();
  const router = useRouter();

  const formatTokenPrice = (price) => {
    const convertedNumber = parseFloat(price).toString();
    const result = convertedNumber.match(/^-?\d+(?:\.\d{0,6})?/)[0];

    return result;
  };

  const [stickerCount, setStickerCount] = useState(0);
  const [lstMessage, setLstMessage] = useState([]);
  const [lastSticker, setLastSticker] = useState('');
  const [lastAddress, setLastAddress] = useState('');
  const [allCount, setAllCount] = useState(0);
  const [standardTime, setStandardTime] = useState(REMAIN_BASIC_TIMER);
  const [finishFlag, setFinishFlag] = useState(0);

  const readableAddress = (addr) => {
    return `${addr.slice(0, 4)}...${addr.slice(addr.length - 2)}`;
  };

  const [remainTime, setRemainTime] = useState(REMAIN_BASIC_TIMER);

  const commonCheckRoomStatus = async () => {
    checkRoomStatus(id)
    .then(data => {
      if(data.successMessage == 0) {
        if(data.result[0].finished == 1) {          
          router.push('/');
        } else if (data.result[0].finished == 0) {

          getGameTokenByAddress(id, address)
          .then(data => {
            if(data.successMessage == 0) {
              console.log("getGameTokenByAddress");
              console.log(data.result[0]);
              setStickerCount(data.result[0].sticker);
            }
          })
          .catch(error => console.error('getGameTokenByAddress Error:', error));

          getMessagesByRoomId(id)
          .then(data => {
            if(data.successMessage == 0) {
              setAllCount(data.result.length);
              if(allCount > lstMessage.length) {
                if(allCount < TOKEN_MIDDLE_COUNT) {
                  setStandardTime(REMAIN_BASIC_TIMER);
                } else if ( allCount > TOKEN_MIDDLE_COUNT & allCount < TOKEN_HIGH_COUNT) {
                  setStandardTime(REMAIN_MIDDLE_TIMER);
                } else if (allCount > TOKEN_HIGH_COUNT) {
                  setStandardTime(REMAIN_HIGH_TIMER);
                }

                setLstMessage(data.result);
              }
              const msgTime = new Date(data.result[data.result.length - 1].createdAt);
              const now = new Date();
              console.log(msgTime.getFullYear()+ "," + msgTime.getMonth()+ "," + msgTime.getDate()+ "," + msgTime.getHours()+ "," + msgTime.getMinutes()+ "," + msgTime.getSeconds());
              console.log(now.getFullYear()+ "," + now.getMonth()+ "," + now.getDate()+ "," + now.getHours()+ "," + now.getMinutes()+ "," + now.getSeconds());
              if(((msgTime.getFullYear() - now.getFullYear()) != 0) || ((msgTime.getMonth() - now.getMonth()) != 0)) return;

              // Calculate total seconds
              const totalSecondsNow = 86400 * now.getDate() + (now.getHours() + 8) * 3600 + now.getMinutes() * 60 + now.getSeconds();
              const totalSecondsLastMsg = 86400 * msgTime.getDate() + msgTime.getHours() * 3600 + msgTime.getMinutes() * 60 + msgTime.getSeconds();
              console.log(totalSecondsNow);
              console.log(totalSecondsLastMsg);
              if( standardTime - (totalSecondsNow - totalSecondsLastMsg) >= 0) {
                setRemainTime(standardTime - (totalSecondsNow - totalSecondsLastMsg));
                console.log(remainTime);
              } else {
                router.push(`/`);
              }
              const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
              console.log(currentTimeInSeconds);
              setLastSticker(data.result[data.result.length - 1].stickerType);
              setLastAddress(data.result[data.result.length - 1].walletAddress);
            }
          })
          .catch(error => console.error('getMessagesByRoomId', error));
        }
      }
    })
    .catch(error => console.error('CheckRoomStatus Error:', error));
  };

  const commonSendMessageByRoomId = async (_sticker) => {
    console.log('hi1');
    sendMessageByRoomId(id, address, _sticker)
    .then(data => {
      if(data.successMessage == 0) {
        console.log('sendMessageByRoomId');
        console.log(data.result);
        // const remainSticker = stickerCount - 1;
        // console.log(remainSticker);
        // setStickerCount(remainSticker);
      }
    })
    .catch(error => console.error('sendMessageByRoomId', error));
  };
  
  const commonFinishGame = async () => {
    console.log('Finish Game');
    finishGameByWinner(id, address)
    .then(data => {
      router.push('/');
      if(data.successMessage == 0) {
        
      }
    })
    .catch(error => console.error('finishGameByWinner', error));
  }
  useEffect(() => {
    
    const intervalId = setInterval(() => {
      if(remainTime == 0) {
        console.log('winnerAddress' + lastAddress);
        console.log('userAddress' + address);
        if((lastAddress == address) && (finishFlag == 0)) {
          setFinishFlag(1);
          commonFinishGame();
        } else {
          router.push('/');
        }
        return;
      } else {
        commonCheckRoomStatus();
      }
    }, 1000);

    return () => {
        clearInterval(intervalId); // Cleanup function to clear the interval     
    };
  });

  return (
    <div className="flex flex-col w-full h-full gap-4 sm:gap-8 xl:gap-12 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="flex lg:hidden">
        <p className="font-bold text-white">Console</p>
      </div>
      <div className="w-full h-fit gap-4 sm:gap-8 xl:gap-12 lg:flex-row xl:flex-row">
        {address ? (
          <>
            <Container className={"w-full"}>
              <div className=" h-full gap-4 p-4 relative justify-center">
                {lstMessage.map((item, key) => (
                  <div className="mt-[20px] w-full flex">
                    {item.walletAddress == address ? (<div style={{marginLeft: "auto"}}></div>) : (<div></div>)}
                    <div className="mx-4 px-10 py-4 rounded-[4px]">
                      {/* <img src=""/> */}
                      <div className="text-center">
                        <Image
                          className="m-auto"
                          src={"/avatar.svg"}
                          width="32"
                          height="32"
                          alt="avatar ico"
                        />
                      </div>
                      <div className="text-center text-white">{readableAddress(item.walletAddress)}</div>
                    </div>
                    <div style={{paddingTop:30}}>
                      <div className="w-[200px] text-center rounded-full">
                        <video autoPlay loop name="media">
                          <source src={`/image/stickers/sticker${item.stickerNum}.webm`} type="video/webm"/>
                        </video>
                      </div>
                      <div className="mt-2 px-2 text-right text-white">{item.createdAt}</div>
                    </div>
                  </div>
                  
                ))}
              </div>
            </Container>
            <div className="fixed bottom-0 w-full">
              <div className="flex w-full h-full gap-4 p-4 relative justify-center">
                <Button onClick={() => { 
                  if(lastAddress == address) return;
                  if (stickerCount == 0) return; 
                  commonSendMessageByRoomId(stickerCount);
                  }}>Sticker ({stickerCount})</Button>
                <div className="mt-2 ml-[10px] w-[200px] text-2xl flex text-white">
                  <div>remain-time:</div>
                  <div>{remainTime}</div>
                </div>
                <div className="mt-2 ml-[10px] w-[200px] text-2xl flex text-white">
                  <div>token-count:</div>
                  <div>{allCount}</div>
                </div>
                <div className="mt-2 ml-[10px] w-[300px] text-2xl flex text-white">
                  <div>winner:</div>
                  <div>{lastAddress}</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <RequireWallet title={"Connect a wallet to see your DGI totals"} />
          </>
        )}
      </div>
    </div>
  );
}
