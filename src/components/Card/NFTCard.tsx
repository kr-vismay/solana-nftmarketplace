"use client";
import { TNFTData } from "@/types/fetchedNFT";
import Image from "next/image";
import React from "react";

import { useDashboardMenuStore } from "@/store/Dashboard";
import { useShallow } from "zustand/shallow";
import { Badge } from "../ui/badge";
import { TListedNFT } from "@/types/listedNFT";
import { useListingStore } from "@/store/Listing";

function NFTCard({
  nft,
  isListedNFT,
  isMyNFT,
}: {
  nft: TNFTData | TListedNFT;
  isListedNFT: boolean;
  isMyNFT?: boolean;
}) {
  const [setIsOpen, setNFTData] = useDashboardMenuStore(
    useShallow((state) => [state.setISOpen, state.setNFTData])
  );

  const [setISOpenBuyModel, setListedNFTData, setIsOpenCancelModel] =
    useListingStore(
      useShallow((state) => [
        state.setISOpenBuyModel,
        state.setListedNFTData,
        state.setIsOpenCancelModel,
      ])
    );

  return (
    <div className=" text-white relative h-[300px] group  rounded-xl hover:cursor-pointer">
      <div className="h-[80%] w-full overflow-hidden rounded-xl relative shadow-[0px_2px_18px_0px_#805ad5]">
        <Image
          src={nft.image ?? ""}
          width={500}
          height={500}
          alt=""
          className="w-full h-full object-cover rounded-xl group-hover:scale-125 transition-all duration-500 "
        />
        <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-sm">
          {nft.symbol}
        </Badge>
      </div>
      <div className="h-[35%] w-[90%] p-3 absolute bg-card-primary left-[5%] right-[5%] shadow-[inset_0px_0px_7px_0px_#d6bcfa] rounded-xl bottom-3">
        <span className="font-bold text-lg">{nft.name}</span>

        <button
          onClick={() => {
            if (isListedNFT && !isMyNFT) {
              setISOpenBuyModel(true);
              setListedNFTData(nft as TListedNFT);
            } else if (isListedNFT && isMyNFT) {
              setIsOpenCancelModel(true);
              setListedNFTData(nft as TListedNFT);
            } else {
              setIsOpen(true);
              setNFTData(nft as TNFTData);
            }
          }}
          className="bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end w-full py-2 rounded-lg mt-2 hover:cursor-pointer"
        >
          {isListedNFT && !isMyNFT
            ? "Buy NFT"
            : isListedNFT && isMyNFT
            ? "Cancel Listing"
            : "Sell NFT"}
        </button>
      </div>
    </div>
  );
}

export default NFTCard;
