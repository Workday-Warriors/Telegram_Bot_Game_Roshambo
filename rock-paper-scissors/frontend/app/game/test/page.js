"use client";

import { Container } from "@/components/base/Container";
import RequireWallet from "@/components/base/RequireWallet";
import { useUserProfileContext } from "@/lib/contexts/UserProfileProvider";
import { useAccount } from "wagmi";
import Button from "@/components/base/Button";
import Room from "@/components/base/Room";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function GameRoom({params: {id}}) {
  const { address, isConnecting, isDisconnected } = useAccount();

  const { route, setRoute } = useUserProfileContext();
  const router = useRouter();

  const formatTokenPrice = (price) => {
    const convertedNumber = parseFloat(price).toString();
    const result = convertedNumber.match(/^-?\d+(?:\.\d{0,6})?/)[0];

    return result;
  };

  var [countRock, setCountRock] = useState(3);
  var [countScissors, setCountScissors] = useState(3);
  var [countPaper, setCountPaper] = useState(3);
  var [lstMessage, setLstMessage] = useState([
    {content: "hello", user: "john", createdTime: "2023-1-1"}, 
    {content: "hello", user: "john", createdTime: "2024-1-2"}, 
    {content: "hello", user: "me", createdTime: "2024-1-3"}]);

  //room number
  const paramId = id;
  
  const remainTokenCountByType = (_type) => {
    if(_type == "rock") {
      setCountRock(3);
    } else if (_type == "scissors") {
      setCountScissors(3);
    } else if(_type == "paper") {
      setCountPaper(3);
    }
  };

  const [remainTime, setRemainTime] = useState(5);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if(messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if(remainTime == 0) return;
      const tmpTime = remainTime - 1;
      setRemainTime(tmpTime);
    }, 1000);

    return () => {
        clearInterval(intervalId); // Cleanup function to clear the interval     
    };

    scrollToBottom();
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
                    {item.user == "me" ? (<div style={{marginLeft: "auto"}}></div>) : (<div></div>)}
                    <div className="mx-4 bg-[#ffffff] px-10 py-4 rounded-[4px]">
                      {/* <img src=""/> */}
                      <div className="p-4 bg-[#000000] rounded-full"></div>
                      <div className="text-center">{item.user}</div>
                    </div>
                    <div className="">
                      <div className="bg-[#ffffff] px-20 py-4 text-center rounded-full">{item.content}</div>
                      <div className="mt-2 px-2 text-right text-white">{item.createdTime}</div>
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
                <Button onClick={() => { if (countRock == 0 ) return; const tmpCount = countRock - 1; setCountRock(tmpCount);}}>Rock ({countRock})</Button>
                <Button onClick={() => { if (countScissors == 0 ) return; const tmpCount = countScissors - 1; setCountScissors(tmpCount);}}>Scissors ({countScissors})</Button>
                <Button onClick={() => { if (countPaper == 0 ) return; const tmpCount = countPaper -1; setCountPaper(tmpCount); setLstMessage([...lstMessage, {content: "paper", user: "me", createdTime: "2024.1.1"}]);}}>Paper ({countPaper})</Button>
                <div className="mt-2 ml-[10px] w-[200px] text-2xl flex text-white">
                  <div>remain-time:</div>
                  <div>{remainTime}</div>
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
