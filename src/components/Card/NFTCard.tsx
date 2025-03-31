"use client";
import { TNFTData } from "@/types/fetchedNFT";
import { TListedNFT } from "@/types/listedNFT";
import Image from "next/image";
import React from "react";

import { useDashboardMenuStore } from "@/store/Dashboard";
import { useShallow } from "zustand/shallow";
import { Badge } from "../ui/badge";
import { useListingStore } from "@/store/Listing";
import { useRouter } from "next/navigation";

function NFTCard({
  listedNFT,
  nft,
  isListedNFT,
  isMyNFT,
}: {
  listedNFT?: TListedNFT;
  nft?: TNFTData;
  isListedNFT: boolean;
  isMyNFT?: boolean;
}) {
  const [setNFTData, setISOpen] = useDashboardMenuStore(
    useShallow((state) => [state.setNFTData, state.setISOpen])
  );

  const [setListedNFTData] = useListingStore(
    useShallow((state) => [state.setListedNFTData])
  );

  const router = useRouter();

  const displayNFT = listedNFT || nft; // Use listedNFT if available, otherwise use nft

  return (
    <div className="text-white relative h-[300px] group rounded-xl hover:cursor-pointer">
      <div className="h-[80%] w-full overflow-hidden rounded-xl relative shadow-[0px_2px_18px_0px_#805ad5]">
        {displayNFT ? (
          <Image
            src={displayNFT.image ?? ""}
            width={500}
            height={500}
            alt={displayNFT.name ?? "NFT Image"}
            className="w-full h-full object-cover rounded-xl group-hover:scale-125 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-xl">
            <span className="text-gray-400">No NFT Available</span>
          </div>
        )}
        {displayNFT && (
          <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-sm">
            {displayNFT.symbol ?? "N/A"}
          </Badge>
        )}
      </div>
      <div
        className={`h-[35%] bottom-3 w-[90%] p-3 absolute bg-card-primary left-[5%] right-[5%] shadow-[inset_0px_0px_7px_0px_#d6bcfa] rounded-xl`}
      >
        <span className="font-bold text-lg">
          {displayNFT?.name ?? "Unknown NFT"}
        </span>

        <button
          onClick={() => {
            if (!displayNFT) return; // Prevent errors if no NFT is available

            if (isListedNFT && listedNFT) {
              setListedNFTData(listedNFT);
              if (isMyNFT) {
                router.push(
                  `/activeListings/${listedNFT.vaultAccount}/${listedNFT.price}`
                );
              } else {
                router.push(
                  `/discover/${listedNFT.vaultAccount}/${listedNFT.price}`
                );
              }
            } else if (nft) {
              setNFTData(nft);
              setISOpen(true);
            }
          }}
          className="bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end w-full py-2 rounded-lg mt-2 hover:cursor-pointer"
        >
          {isListedNFT ? "Explore NFT" : "Sell NFT"}
        </button>
      </div>
    </div>
  );
}

export default NFTCard;
