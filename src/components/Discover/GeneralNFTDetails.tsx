"use client";
import React, { useEffect, useState } from "react";
import BuyNFTModel from "./BuyNFTModel";
import MakeOfferModel from "./MakeOfferModel";
import NFTdetails from "../ActiveListings/SingleNFT/NFTdetails";
import UserOffer from "./UserOffer";
import { useShallow } from "zustand/shallow";
import { useListingStore } from "@/store/Listing";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { listedNFT } from "@/utils/listedNFT";

function GeneralNFTDetails({
  price,
  vault,
  isMyNFT,
}: {
  price: string;
  vault: string;
  isMyNFT: boolean;
}) {
  const [listedNFTData, setListedNFTData] = useListingStore(
    useShallow((state) => [state.listedNFTData, state.setListedNFTData])
  );
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const listedNft = async () => {
    try {
      setLoading(true);
      if (!publicKey || !wallet || !connection) {
        setLoading(false);
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

          if (selectedNFT) {
            setListedNFTData(selectedNFT);
            setLoading(false);
          }
          setLoading(false);
        }
      }
    } catch (error) {
      console.log("🚀 ~ listedNft ~ error:", error);
      setLoading(false);
    }
  };
  const isAnyFieldEmpty = Object.values(listedNFTData).some(
    (value) => value === ""
  );
  useEffect(() => {
    if (isAnyFieldEmpty) {
      listedNft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, vault, price]);
  return (
    <div className="p-4">
      <BuyNFTModel reFetch={listedNft} />
      <MakeOfferModel reFetch={listedNft} />
      <NFTdetails
        price={price}
        vault={vault}
        isMyNFT={false}
        loading={loading}
      />
      <UserOffer reFetch={listedNft} />
    </div>
  );
}

export default GeneralNFTDetails;
