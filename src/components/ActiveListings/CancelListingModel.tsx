"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useShallow } from "zustand/shallow";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Wallet,
  DollarSign,
  Info,
  CheckCircle2,
  Loader,
} from "lucide-react";

import { useListingStore } from "@/store/Listing";

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { cancelListing } from "@/utils/cancelListing";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

function CancelListingModel({ reFetch }: { reFetch: () => void }) {
  const [isOpenCancelModel, setIsOpenCancelModel, listedNFTData] =
    useListingStore(
      useShallow((state) => [
        state.isOpenCancelModel,
        state.setIsOpenCancelModel,
        state.listedNFTData,
      ])
    );
  const [loading, setLoading] = useState(false);

  const [totalPrice, setTotalPrice] = useState("0");

  const [step, setStep] = useState(1);

  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  useEffect(() => {
    setTotalPrice("0");
  }, [isOpenCancelModel]);

  useEffect(() => {
    const qtyNum =
      Number.parseFloat(listedNFTData ? listedNFTData.quantity : "0") || 0;
    const priceNum =
      Number.parseFloat(listedNFTData ? listedNFTData.price.toString() : "0") ||
      0;
    setTotalPrice(((qtyNum * priceNum) / 1000000000).toFixed(4));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listedNFTData?.quantity, isOpenCancelModel]);

  const handleCancelListing = async () => {
    setLoading(true);
    if (step === 1) {
      setStep(2);
      setLoading(false);
    } else if (step === 2) {
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
        const tokenATA = await getAssociatedTokenAddress(
          new PublicKey(listedNFTData.mint),
          publicKey as PublicKey,
          false,
          TOKEN_2022_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        await cancelListing(
          listedNFTData.mint,
          listedNFTData.pda,
          listedNFTData.vaultAccount,
          listedNFTData.authority,
          tokenATA,
          connection,
          wallet,
          publicKey,
          listedNFTData.price,
          listedNFTData.offers,
          reFetch
        );
        setStep(1);
        setIsOpenCancelModel(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClose = () => {
    setStep(1);
    setIsOpenCancelModel(false);
  };

  return (
    <Dialog open={isOpenCancelModel} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-card-primary to-card-primary/90 border border-white/10 p-0 text-white rounded-xl overflow-hidden shadow-2xl w-[90vw] max-w-4xl sm:max-w-4xl ">
        <div className="relative flex justify-between items-center p-4 border-b border-white/10 bg-black/20">
          <h2 className="text-xl font-bold">
            {step === 1 ? "Cancel Listing" : "Confirm Cancellation"}
          </h2>
        </div>
        <div className="flex items-center gap-2 justify-end pr-5">
          <Badge
            variant={step === 1 ? "outline" : "default"}
            className="bg-selected-content text-white"
          >
            1
          </Badge>
          <ArrowRight className="w-4 h-4 text-white/50" />
          <Badge
            variant={step === 2 ? "outline" : "default"}
            className="bg-selected-content text-white"
          >
            2
          </Badge>
        </div>
        <div className="relative flex sm:flex-row flex-col w-full h-[470px] overflow-auto mb-4">
          <div className="flex flex-col gap-4 sm:border-r border-white/10 p-5 sm:w-2/5">
            <div className="relative">
              <Image
                src={listedNFTData?.image || ""}
                alt={listedNFTData?.name || "NFT"}
                width={500}
                height={500}
                className="object-cover rounded-xl aspect-square w-full"
              />
              <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm">
                {listedNFTData?.symbol}
              </Badge>
            </div>

            <h3 className="text-white font-bold text-2xl mt-2 flex items-center gap-2">
              {listedNFTData?.name}
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Wallet className="w-4 h-4" />
                <span>
                  Quantity:{" "}
                  <span className="font-bold text-white">
                    {listedNFTData?.quantity.toString()}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="sm:w-3/5 p-5 flex flex-col">
            {step === 1 ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Cancel Listing</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="quantity"
                      className="text-white flex items-center gap-1"
                    >
                      Quantity <Info className="w-3 h-3 text-white/60" />
                    </Label>
                    <div className="relative">
                      <Input
                        id="quantity"
                        disabled={true}
                        type="text"
                        value={listedNFTData?.quantity.toString()}
                        className={`input-box disabled:opacity-100 `}
                        placeholder="Enter quantity"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="price"
                      className="text-white flex items-center gap-1"
                    >
                      Price per NFT (SOL){" "}
                      <Info className="w-3 h-3 text-white/60" />
                    </Label>
                    <div className="relative">
                      <Input
                        id="price"
                        disabled={true}
                        type="text"
                        value={(
                          Number(listedNFTData?.price) / 1000000000
                        ).toString()}
                        className={`input-box disabled:opacity-100 `}
                        placeholder="Enter price in SOL"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                        SOL
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10 my-4" />

                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Total Value</span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-xl font-bold">
                          {totalPrice} SOL
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 mt-1">
                      Estimated value: $
                      {(Number.parseFloat(totalPrice) * 3500).toFixed(2)} USD
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-4">
                  Confirm Your Cancellation
                </h3>

                <div className="bg-black/30 p-4 rounded-lg space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">NFT</span>
                    <span className="font-semibold">{listedNFTData?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Quantity</span>
                    <span className="font-semibold">
                      {listedNFTData?.quantity.toString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Price per NFT</span>
                    <span className="font-semibold">
                      {(Number(listedNFTData?.price) / 1000000000).toString()}{" "}
                      SOL
                    </span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Total Value</span>
                    <span className="text-xl font-bold">{totalPrice} SOL</span>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg mb-auto">
                  <p className="text-sm text-white/90 flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Once your listing cancellation is confirmed, the NFT will be
                    instantly removed from the marketplace and returned to your
                    wallet. You will regain full ownership and control over your
                    asset. Happy collecting!
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {step === 2 && (
                <Button
                  variant="outline"
                  className="flex-1 border-white/20 bg-outline-button-background hover:bg-outline-button-background hover:text-white text-white hover:cursor-pointer"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              )}
              <Button
                className="flex-1 bg-gradient-to-r from-light-button-gradient-start to-light-button-gradient-end hover:opacity-90 transition-all hover:cursor-pointer "
                disabled={loading}
                onClick={handleCancelListing}
              >
                {step === 1 ? (
                  "Continue"
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm cancellation{" "}
                    {loading && <Loader className="ml-2 animate-spin" />}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CancelListingModel;
