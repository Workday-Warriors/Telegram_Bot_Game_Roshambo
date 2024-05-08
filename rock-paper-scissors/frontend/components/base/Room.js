"use client";

import clsx from "clsx";

export default function Room({
    className,
    onClick,
    roomName
  }) {
    return (
        <div 
            className={clsx(`h-[100px] w-[200px] bg-[#ffffff] justify-center cursor-pointer ${className}`)} 
            onClick={onClick} >
            <div className="text-center h-[100px] bg-[#ffffff]" style={{ lineHeight: "100px", fontSize: "20px", fontWeight: "bolder", color: "Green"}}>{roomName}</div>
        </div>
    );
  }