"use client";
import OfferCardSkeleton from "@/components/Card/OfferCardSkeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useCopyToClipboard from "@/hook/useCopyToClipboard";
import { useListingStore } from "@/store/Listing";
import { acceptOffer } from "@/utils/accetOffer";
import { getExplorerLink } from "@/utils/getExplorerLink";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { Copy, CopyCheck, Loader, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useShallow } from "zustand/shallow";

function ActiveOffers({
  reFetch,
  isLoading,
}: {
  reFetch: () => void;
  isLoading: boolean;
}) {
  const { copied, copyToClipboard } = useCopyToClipboard();
  const [listedNFTData] = useListingStore(
    useShallow((state) => [state.listedNFTData])
  );
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const handleAccept = async (
    offerIndex: number,
    buyerTokenAccount: PublicKey,
    buyer: PublicKey
  ) => {
    setLoading(true);
    try {
      if (
        !publicKey ||
        !listedNFTData ||
        !listedNFTData.pda ||
        !wallet ||
        !listedNFTData.authority
      ) {
        throw new Error("Invalid wallet or PDA");
      }

      await acceptOffer(
        connection,
        wallet,
        publicKey,
        buyerTokenAccount,
        new PublicKey(listedNFTData.vaultAccount),
        listedNFTData.mint.toString(),
        listedNFTData.price.toString(),
        offerIndex,
        listedNFTData.offers,
        buyer,
        reFetch
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col gap-4 sm:p-4 pt-4">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
        </div>
      ) : (
        listedNFTData &&
        listedNFTData.offers.length > 0 && (
          <>
            <span className="text-xl text-white font-bold">Offers</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {listedNFTData.offers.map((offer, index) => (
                <Card
                  className="flex flex-col  bg-gradient-to-br from-card-primary to-card-primary/90 border border-white/10  text-white rounded-xl  gap-4 shadow-[inset_0px_0px_7px_0px_#d6bcfa]"
                  key={offer.buyer.toBase58()}
                >
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-base font-medium text-white">
                          Wallet Address
                        </span>
                        <Link
                          href={getExplorerLink(
                            offer.buyer.toBase58(),
                            "devnet"
                          )}
                          target="_blank"
                        >
                          <SquareArrowOutUpRight
                            size={18}
                            className="text-white/50 cursor-pointer"
                          />
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <span className="font-mono  ">
                          {offer.buyer.toBase58().slice(0, 4)}...
                          {offer.buyer.toBase58().slice(-4)}
                        </span>
                        {copied ? (
                          <CopyCheck
                            size={18}
                            className="cursor-pointer text-xs"
                          />
                        ) : (
                          <Copy
                            onClick={() => {
                              copyToClipboard(offer.buyer.toBase58());
                              toast.success("Copied to clipboard");
                            }}
                            size={18}
                            className="cursor-pointer text-xs"
                          />
                        )}
                      </div>
                    </div>

                    <hr className="border-white/40" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-base font-medium text-white">
                          Price
                        </div>
                        <div className="text-sm font-semibold text-white/40">
                          {offer.price.toString()} SOL
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-base font-medium text-white">
                          Quantity
                        </div>
                        <div className="text-sm font-semibold text-white/40">
                          {offer.quantity.toString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <button
                      className="w-full bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end py-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      disabled={loading}
                      onClick={() => {
                        handleAccept(
                          index,
                          offer.buyerTokenAccount,
                          offer.buyer
                        );
                      }}
                    >
                      Accept Offer{" "}
                      {loading && <Loader className="animate-spin ml-2" />}
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}

export default ActiveOffers;
