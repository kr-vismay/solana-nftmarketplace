"use client";
import React, { useEffect, useState } from "react";
import MyListedNFT from "./MyListedNFT";
import GeneralListedNFT from "./GeneralListedNFT";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { listedNFT } from "@/utils/listedNFT";
import { TListedNFT } from "@/types/listedNFT";
import { useListingStore } from "@/store/Listing";
import { useShallow } from "zustand/shallow";
import WalletConnectionWarning from "../Wallet/WalletConnectionWarning";
import NFTCardSkeleton from "../Card/NFTCardSkeleton";

function ListedNFT() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();
  const [isOpenBuyModel, isOpenCancelModel] = useListingStore(
    useShallow((state) => [state.isOpenBuyModel, state.isOpenCancelModel])
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [userSpecificNFT, setUserSpecificNFT] = useState<TListedNFT[]>([]);

  const [generalNFT, setGeneralNFT] = useState<TListedNFT[]>([]);

  const listedNft = async () => {
    try {
      if (!publicKey || !wallet || !connection) {
      } else {
        const res = await listedNFT(connection, wallet, publicKey);

        if (res?.success) {
          setUserSpecificNFT(res?.filteredNFTsForSpecificUser);
          setGeneralNFT(res?.filteredNFTsForGeneralUser);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log("🚀 ~ listedNft ~ error:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    listedNft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, isOpenBuyModel, isOpenCancelModel]);
  return publicKey ? (
    loading ? (
      <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-8 py-3">
        <NFTCardSkeleton />
        <NFTCardSkeleton />
        <NFTCardSkeleton />
        <NFTCardSkeleton />
        <NFTCardSkeleton />
        <NFTCardSkeleton />
      </div>
    ) : (
      <div className="flex flex-col gap-5">
        {userSpecificNFT &&
          userSpecificNFT.length <= 0 &&
          generalNFT &&
          generalNFT.length <= 0 && (
            <div className="text-white text-center text-2xl sm:text-3xl">
              There is no any listed NFT
            </div>
          )}{" "}
        {userSpecificNFT && userSpecificNFT.length > 0 && (
          <MyListedNFT nft={userSpecificNFT} />
        )}
        {generalNFT && generalNFT.length > 0 && (
          <GeneralListedNFT nft={generalNFT} />
        )}{" "}
      </div>
    )
  ) : (
    <WalletConnectionWarning />
  );
}

export default ListedNFT;
