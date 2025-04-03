"use client";
import { TNFTData } from "@/types/fetchedNFT";
import { fetchNFT } from "@/utils/fetchNFT";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import React, { useEffect, useState } from "react";

import NFTCard from "../Card/NFTCard";
import NFTCardSkeleton from "../Card/NFTCardSkeleton";

import NFTInfoModal from "./NFTInfoModel";
import WalletConnectionWarning from "../Wallet/WalletConnectionWarning";
import Link from "next/link";

function FetchedNFT() {
  const { publicKey } = useWallet();
  const [nftData, setNftData] = useState<TNFTData[] | []>([]);
  const [loading, setLoading] = useState(true);

  const fetchNFTData = async () => {
    if (publicKey) {
      setLoading(true);
      const res = await fetchNFT(publicKey as PublicKey);
      if (res?.success) {
        setNftData(res?.data);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNFTData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);
  return publicKey ? (
    loading ? (
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
    ) : nftData && nftData.length > 0 ? (
      <div className="mt-5">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <NFTInfoModal refetch={fetchNFTData} />

        <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-8 py-3 mt-3">
          {nftData.map((nft: TNFTData) => (
            <NFTCard
              isListedNFT={false}
              nft={nft as TNFTData}
              key={nft.mintAddress}
            />
          ))}
        </div>
      </div>
    ) : (
      <div className="text-white flex justify-center items-center gap-6 flex-col mt-5">
        <div className=" font-bold text-2xl sm:text-3xl text-center">
          There is no NFT in your wallet
        </div>
        <Link
          href={"/"}
          className="bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end py-2 px-4 rounded-lg"
        >
          Create NFT
        </Link>
      </div>
    )
  ) : (
    <WalletConnectionWarning />
  );
}

export default FetchedNFT;
