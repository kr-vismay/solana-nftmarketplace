"use client";
import React, { useEffect, useState } from "react";
import BuyNFTModel from "./BuyNFTModel";
import MakeOfferModel from "./MakeOfferModel";
import NFTdetails from "../ActiveListings/SingleNFT/NFTdetails";
import UserOffer from "./UserOffer";
import { useShallow } from "zustand/shallow";
import { useListingStore } from "@/store/Listing";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { listedNFT } from "@/utils/listedNFT";

import { PublicKey } from "@solana/web3.js";

function GeneralNFTDetails({
  price,
  vault,
  isMyNFT,
}: {
  price: string;
  vault: string;
  isMyNFT: boolean;
}) {
  const [setListedNFTData] = useListingStore(
    useShallow((state) => [state.setListedNFTData])
  );

  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);

  const [isAnyFieldEmpty, setIsAnyFieldEmpty] = useState(false);

  const listedNft = async () => {
    try {
      setLoading(true);

      const res = await listedNFT(
        connection,
        wallet as AnchorWallet,
        publicKey as PublicKey
      );

      if (res?.success) {
        const selectedNFT = isMyNFT
          ? res.filteredNFTsForSpecificUser.find(
              (item) =>
                item.vaultAccount.toString() === vault &&
                item.price.toString() === price
            )
          : res.filteredNFTsForGeneralUser.find(
              (item) =>
                item.vaultAccount.toString() === vault &&
                item.price.toString() === price
            );

        setListedNFTData(
          selectedNFT || {
            price: "",
            quantity: "",
            vaultAccount: "",
            mint: "",
            name: "",
            image: "",
            symbol: "",
            offers: [],
          }
        );

        setIsAnyFieldEmpty(
          !selectedNFT ||
            Object.values(selectedNFT).some((value) => value === "")
        );
      }
    } catch (error) {
      console.log("🚀 ~ listedNft ~ error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listedNft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, vault, price]);

  return (
    <div className="p-4">
      <BuyNFTModel reFetch={listedNft} />
      <MakeOfferModel reFetch={listedNft} />
      <NFTdetails isMyNFT={false} loading={loading} isEmpty={isAnyFieldEmpty} />
      <UserOffer reFetch={listedNft} isLoading={loading} />
    </div>
  );
}

export default GeneralNFTDetails;
