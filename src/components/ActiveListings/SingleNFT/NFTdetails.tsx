"use client";
import { Badge } from "@/components/ui/badge";
import useCopyToClipboard from "@/hook/useCopyToClipboard";
import { useListingStore } from "@/store/Listing";
import { getExplorerLink } from "@/utils/getExplorerLink";

import { Copy, CopyCheck, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";
import { useShallow } from "zustand/shallow";

function NFTdetails({
  isMyNFT,
  loading,
}: {
  price: string;
  vault: string;
  isMyNFT: boolean;
  loading: boolean;
}) {
  const { copied, copyToClipboard } = useCopyToClipboard();

  const [
    listedNFTData,

    setIsOpenCancelModel,
    setIsOpenUpdatePriceModel,
    setISOpenBuyModel,
    setIsOpenMakeOfferModel,
  ] = useListingStore(
    useShallow((state) => [
      state.listedNFTData,

      state.setIsOpenCancelModel,
      state.setIsOpenUpdatePriceModel,
      state.setISOpenBuyModel,
      state.setIsOpenMakeOfferModel,
    ])
  );

  const isAnyFieldEmpty = Object.values(listedNFTData).some(
    (value) => value === ""
  );

  return loading ? (
    <div className="p-4">loading</div>
  ) : isAnyFieldEmpty ? (
    <div className="text-center text-white">No NFT found</div>
  ) : (
    <div className="sm:p-4 ">
      <div className="flex lg:flex-row flex-col  bg-gradient-to-br from-card-primary to-card-primary/90 border border-white/10  text-white rounded-xl md:p-6 p-4 gap-4 shadow-[inset_0px_0px_7px_0px_#d6bcfa]">
        <div className="flex flex-col gap-4 w-full lg:w-[40%] items-center lg:items-start">
          <div className="border border-white/10 rounded-xl  w-fit">
            <div className="bg-selected-content rounded-t-xl py-2 px-4 flex justify-between items-center">
              <span className="font-bold">{listedNFTData.name}</span>
              <Link
                href={getExplorerLink(listedNFTData.mint.toString(), "devnet")}
                target="_blank"
              >
                <SquareArrowOutUpRight className="text-white/40" />
              </Link>
            </div>
            <div className="relative lg:max-w-[400px] lg:max-h-[400px] p-4">
              <Image
                src={listedNFTData.image || ""}
                alt={listedNFTData.name || "NFT"}
                width={500}
                height={500}
                className="object-cover rounded-xl aspect-square "
              />
              <Badge className="absolute top-8 right-8 bg-black/60 backdrop-blur-sm md:text-base text-sm">
                {listedNFTData.symbol}
              </Badge>
            </div>
          </div>
        </div>
        <div className=" flex flex-col gap-4 w-full lg:w-[60%]">
          <div className="flex gap-3 md:flex-row flex-col">
            <div className="flex flex-col gap-2 rounded-xl bg-selected-content p-4 flex-1">
              <span className="font-bold text-lg">Listed Quantity of NFT</span>
              <span className="text-white/50">
                {listedNFTData.quantity.toString()} {listedNFTData.symbol}
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-xl bg-selected-content p-4 flex-1">
              <span className="font-bold text-lg">Price per NFT</span>
              <span className="text-white/50">
                {listedNFTData.price.toString()} SOL
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-selected-content p-4">
            <span className="font-bold text-lg">Mint</span>
            <div className="flex items-center gap-2 justify-between">
              <span className="text-white/50 sm:block hidden">
                {listedNFTData.mint.toString()}
              </span>
              <span className="sm:hidden block text-white/50">
                {listedNFTData.mint.toString().slice(0, 4)}...
                {listedNFTData.mint.toString().slice(-4)}
              </span>
              {copied ? (
                <CopyCheck className="cursor-pointer text-white/50" />
              ) : (
                <Copy
                  onClick={() => {
                    copyToClipboard(listedNFTData.mint.toString());
                    toast.success("Copied to clipboard");
                  }}
                  className="cursor-pointer text-white/50"
                />
              )}
            </div>
          </div>
          <hr className="border-white/30 mt-4" />
          <div className="flex gap-4 sm:flex-row flex-col mt-4">
            <button
              className={`bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end px-4 py-2 rounded-xl cursor-pointer ${
                isMyNFT ? "block" : "hidden"
              }`}
              onClick={() => setIsOpenCancelModel(true)}
            >
              Cancel Listing
            </button>
            <button
              className={`bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end px-4 py-2 rounded-xl cursor-pointer ${
                isMyNFT ? "block" : "hidden"
              }`}
              onClick={() => setIsOpenUpdatePriceModel(true)}
            >
              Update Listing
            </button>
            <button
              className={`bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end px-4 py-2 rounded-xl cursor-pointer ${
                isMyNFT ? "hidden" : "block"
              }`}
              onClick={() => setISOpenBuyModel(true)}
            >
              Buy NFT
            </button>
            <button
              className={`bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end px-4 py-2 rounded-xl cursor-pointer ${
                isMyNFT ? "hidden" : "block"
              }`}
              onClick={() => setIsOpenMakeOfferModel(true)}
            >
              Make Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTdetails;
