import { Badge } from "@/components/ui/badge";
import React from "react";

function NFTDetailsSkeleton() {
  return (
    <div className="sm:p-4 ">
      <div className="flex lg:flex-row flex-col  bg-gradient-to-br from-card-primary to-card-primary/90 border border-white/10  text-white rounded-xl md:p-6 p-4 gap-4 shadow-[inset_0px_0px_7px_0px_#d6bcfa] ">
        <div className="flex flex-col gap-4 w-full lg:w-[40%] items-center lg:items-start ">
          <div className="border border-white/10 rounded-xl w-full  sm:w-[350px] h-[350px]">
            <div className="bg-selected-content rounded-t-xl py-2 px-4 flex justify-between items-center ">
              <div className="bg-[#ab80b7]/50 py-3.5 animate-pulse rounded-lg w-full"></div>
              <div className="bg-[#ab80b7]/50 py-3.5 animate-pulse rounded-lg "></div>
            </div>
            <div className="relative w-full h-[300px] p-4">
              <div className="bg-[#ab80b7]/50 animate-pulse rounded-xl h-full w-full  " />
              <Badge className="absolute top-8 right-8 bg-black/60 backdrop-blur-sm md:text-base text-sm py-3 px-4 animate-pulse"></Badge>
            </div>
          </div>
        </div>
        <div className=" flex flex-col gap-4 w-full lg:w-[60%]">
          <div className="flex gap-3 md:flex-row flex-col">
            <div className="flex flex-col gap-2 rounded-xl bg-selected-content p-4 flex-1">
              <span className="font-bold text-lg">Listed Quantity of NFT</span>
              <div className="bg-[#ab80b7]/50 py-3.5 animate-pulse rounded-lg"></div>
            </div>
            <div className="flex flex-col gap-2 rounded-xl bg-selected-content p-4 flex-1">
              <span className="font-bold text-lg">Price per NFT</span>
              <div className="bg-[#ab80b7]/50 py-3.5 animate-pulse rounded-lg"></div>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-selected-content p-4">
            <span className="font-bold text-lg">Mint</span>
            <div className="flex items-center gap-5 justify-between">
              <div className="bg-[#ab80b7]/50 py-3.5 animate-pulse rounded-lg w-full"></div>
              <div className="bg-[#ab80b7]/50 py-3.5 animate-pulse rounded-lg px-5"></div>
            </div>
          </div>
          <hr className="border-white/30 mt-4" />
          <div className="flex gap-4 sm:flex-row flex-col mt-4">
            <button
              className={`bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end px-14 py-5 rounded-xl cursor-pointer animate-pulse`}
            ></button>
            <button
              className={`bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end px-14 py-5 rounded-xl cursor-pointer animate-pulse`}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTDetailsSkeleton;
