import { TListedNFT } from "@/types/listedNFT";
import React from "react";

import NFTCard from "../Card/NFTCard";

function GeneralListedNFT({ nft }: { nft: TListedNFT[] }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">General Listed NFT</h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-8 py-3">
        {nft.map((nft: TListedNFT) => (
          <NFTCard
            isListedNFT={true}
            nft={nft as TListedNFT}
            key={nft.mint as string}
            isMyNFT={false}
          />
        ))}
      </div>
    </div>
  );
}

export default GeneralListedNFT;
