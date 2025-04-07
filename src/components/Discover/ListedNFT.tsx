"use client";
import React, { useEffect, useState } from "react";
import GeneralListedNFT from "./GeneralListedNFT";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { listedNFT } from "@/utils/listedNFT";
import { TListedNFT } from "@/types/listedNFT";
import { useListingStore } from "@/store/Listing";
import { useShallow } from "zustand/shallow";

import NFTCardSkeleton from "../Card/NFTCardSkeleton";
import NoNFTfound from "../Card/NoNFTfound";
import { PublicKey } from "@solana/web3.js";

function ListedNFT() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();
  const [isOpenBuyModel, isOpenCancelModel] = useListingStore(
    useShallow((state) => [state.isOpenBuyModel, state.isOpenCancelModel])
  );
  const [loading, setLoading] = useState<boolean>(true);

  const [generalNFT, setGeneralNFT] = useState<TListedNFT[]>([]);

  const listedNft = async () => {
    try {
      setLoading(true);
      const res = await listedNFT(
        connection,
        wallet as AnchorWallet,
        publicKey as PublicKey
      );

      if (res?.success) {
        setGeneralNFT(res?.filteredNFTsForGeneralUser);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ listedNft ~ error:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    listedNft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, isOpenBuyModel, isOpenCancelModel]);
  return loading ? (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-8 py-3 mt-5">
      <NFTCardSkeleton />
      <NFTCardSkeleton />
      <NFTCardSkeleton />
      <NFTCardSkeleton />
      <NFTCardSkeleton />
      <NFTCardSkeleton />
      <NFTCardSkeleton />
      <NFTCardSkeleton />
      <NFTCardSkeleton />
      <NFTCardSkeleton />
      <NFTCardSkeleton />
      <NFTCardSkeleton />
    </div>
  ) : (
    <div className="flex flex-col gap-5 mt-5">
      {generalNFT && generalNFT.length <= 0 ? (
        <NoNFTfound />
      ) : (
        <GeneralListedNFT nft={generalNFT} />
      )}
    </div>
  );
}

export default ListedNFT;
