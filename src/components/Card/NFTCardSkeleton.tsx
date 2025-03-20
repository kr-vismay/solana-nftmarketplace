import React from "react";
import { Badge } from "../ui/badge";

function NFTCardSkeleton() {
  return (
    <div className=" text-white relative h-[300px] group  rounded-xl hover:cursor-pointer animate-pulse">
      <div className="h-[80%] w-full overflow-hidden rounded-xl relative shadow-[0px_2px_18px_0px_#805ad5] bg-[#ab80b7]/50">
        <div className="w-full h-full object-cover rounded-xl group-hover:scale-125 transition-all duration-500 " />
        <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-sm px-5 py-3 animate-pulse"></Badge>
      </div>
      <div className="h-[35%] w-[90%] p-3 absolute bg-card-primary left-[5%] right-[5%] shadow-[inset_0px_0px_7px_0px_#d6bcfa] rounded-xl bottom-3">
        <div className="px-14 py-3.5 w-fit rounded-lg  bg-[#ab80b7]/50"></div>
        <div className="px-12 py-3.5 rounded-lg w-full  bg-[#ab80b7]/50 mt-5"></div>
      </div>
    </div>
  );
}

export default NFTCardSkeleton;
