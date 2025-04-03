"use client";
import React, { useEffect, useState } from "react";
import CancelListingModel from "../CancelListingModel";
import UpdateListingPriceModel from "../UpdateListingPriceModel";
import ActiveOffers from "./ActiveOffers";
import NFTdetails from "./NFTdetails";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { listedNFT } from "@/utils/listedNFT";
import { useListingStore } from "@/store/Listing";
import { useShallow } from "zustand/shallow";

export default function SingleNFTDetails({
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

  const [isAnyFieldEmpty, setIsAnyFieldEmpty] = useState(false);
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const listedNft = async () => {
    try {
      setLoading(true);
      if (!publicKey || !wallet || !connection) {
        console.log("No wallet or connection");
      } else {
        const res = await listedNFT(connection, wallet, publicKey);

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
  }, [publicKey, vault, price]);
  return (
    <div className="p-4">
      <CancelListingModel reFetch={listedNft} />
      <UpdateListingPriceModel />
      <NFTdetails isMyNFT={true} loading={loading} isEmpty={isAnyFieldEmpty} />
      <ActiveOffers isLoading={loading} reFetch={listedNft} />
    </div>
  );
}
