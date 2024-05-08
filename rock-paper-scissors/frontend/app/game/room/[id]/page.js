"use client";

import { Container } from "@/components/base/Container";
import RequireWallet from "@/components/base/RequireWallet";
import { useUserProfileContext } from "@/lib/contexts/UserProfileProvider";
import { useAccount } from "wagmi";
import Button from "@/components/base/Button";
import Room from "@/components/base/Room";
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

  const [countRock, setCountRock] = useState(0);
  const [countScissors, setCountScissors] = useState(0);
  const [countPaper, setCountPaper] = useState(0);
  const [lstMessage, setLstMessage] = useState([]);
  const [lastSticker, setLastSticker] = useState('');
  const [lastAddress, setLastAddress] = useState('');
  const [allCount, setAllCount] = useState(0);

  const remainTokenCountByType = (_type) => {
    if(_type == "rock") {
      setCountRock(3);
    } else if (_type == "scissors") {
      setCountScissors(3);
    } else if(_type == "paper") {
      setCountPaper(3);
    }
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
              setCountRock(data.result[0].rock);
              setCountScissors(data.result[0].scissors);
              setCountPaper(data.result[0].paper);
            }
          })
          .catch(error => console.error('getGameTokenByAddress Error:', error));

          getMessagesByRoomId(id)
          .then(data => {
            if(data.successMessage == 0) {
              setAllCount(data.result.length);
              if(allCount > lstMessage.length) {
                if(allCount < TOKEN_MIDDLE_COUNT) {
                  setRemainTime(REMAIN_BASIC_TIMER);
                } else if ( allCount > TOKEN_MIDDLE_COUNT & allCount < TOKEN_HIGH_COUNT) {
                  setRemainTime(REMAIN_MIDDLE_TIMER);
                } else if (allCount > TOKEN_HIGH_COUNT) {
                  setRemainTime(REMAIN_HIGH_TIMER);
                }

                setLstMessage(data.result);
              }
              setLastSticker(lstMessage[lstMessage.length - 1].stickerType);
              setLastAddress(lstMessage[lstMessage.length - 1].walletAddress);
            }
          })
          .catch(error => console.error('getMessagesByRoomId', error));
        }
      }
    })
    .catch(error => console.error('CheckRoomStatus Error:', error));
  };

  const commonSendMessageByRoomId = async (_sticker) => {
    sendMessageByRoomId(id, address, _sticker)
    .then(data => {
      if(data.successMessage == 0) {
      }
    })
    .catch(error => console.error('getMessagesByRoomId', error));
  };
  
  const commonFinishGame = async () => {
    finishGameByWinner(id, address)
    .then(data => {
      if(data.successMessage == 0) {
        router.push('/');
      }
    })
    .catch(error => console.error('getMessagesByRoomId', error));
  }
  useEffect(() => {
    
    const intervalId = setInterval(() => {
      if(remainTime == 0) {
        if(lastAddress == address) {
          commonFinishGame();
        } else {
          router.push('/');
        }
        return;
      }
      const tmpTime = remainTime - 1;
      setRemainTime(tmpTime);
      commonCheckRoomStatus();
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
          // address === ADMIN_ADDRESS ?? (
          // <Container className={"w-full"}>
          //   <div className="flex w-full h-full gap-4 p-4 relative justify-center">
          //     <Button>
          //       Create a room
          //     </Button>
          //   </div>
          // </Container>)
          <>
            <Container className={"w-full"}>
              <div className=" h-full gap-4 p-4 relative justify-center">
                {lstMessage.map((item, key) => (
                  <div className="mt-[20px] w-full flex">
                    {item.walletAddress == address ? (<div style={{marginLeft: "auto"}}></div>) : (<div></div>)}
                    <div className="mx-4 bg-[#ffffff] px-10 py-4 rounded-[4px]">
                      {/* <img src=""/> */}
                      <div className="p-4 bg-[#000000] rounded-full"></div>
                      <div className="text-center">{item.walletAddress}</div>
                    </div>
                    <div className="">
                      <div className="bg-[#ffffff] px-20 py-4 text-center rounded-full">{item.stickerType}</div>
                      <div className="mt-2 px-2 text-right text-white">{item.createdAt}</div>
                    </div>
                  </div>
                  
                ))}
              </div>
            </Container>
            <div className="fixed bottom-0 w-full">
              <div className="flex w-full h-full gap-4 p-4 relative justify-center">
              {/* <Button onClick={remainTokenCountByType("rock")}>Rocks({countRock})</Button>
              <Button onClick={remainTokenCountByType("scissors")}>Scissors({countScissors})</Button>
              <Button onClick={remainTokenCountByType("rock")}>Papers({countPaper})</Button> */}
                <Button onClick={() => { 
                  if(lastAddress == address) return;
                  if (countRock == 0 || lastSticker == "Rock" || lastSticker == "Paper") return; 
                  commonSendMessageByRoomId("Rock");
                  }}>Rock ({countRock})</Button>
                <Button onClick={() => { 
                  if(lastAddress == address) return;
                  if (countScissors == 0 || lastSticker == "Scissors" || lastSticker == "Rock") return; 
                  commonSendMessageByRoomId("Scissors");
                  }}>Scissors ({countScissors})</Button>
                <Button onClick={() => { 
                  if(lastAddress == address) return;
                  if (countPaper == 0 || lastSticker == "Paper" || lastSticker == "Scissors") return; 
                  commonSendMessageByRoomId("Paper");
                  }}>Paper ({countPaper})</Button>
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
