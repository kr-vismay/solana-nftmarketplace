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
  AlertCircle,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useListingStore } from "@/store/Listing";

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { makeOffer } from "@/utils/makeOffer";

function MakeOfferModel({ reFetch }: { reFetch: () => void }) {
  const [isOpenMakeOfferModel, setIsOpenMakeOfferModel, listedNFTData] =
    useListingStore(
      useShallow((state) => [
        state.isOpenMakeOfferModel,
        state.setIsOpenMakeOfferModel,
        state.listedNFTData,
      ])
    );

  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("1");
  const [totalPrice, setTotalPrice] = useState("0");
  const [isValidQuantity, setIsValidQuantity] = useState(true);
  const [isValidPrice, setIsValidPrice] = useState(true);
  const [step, setStep] = useState(1);
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
    setQuantity(listedNFTData ? listedNFTData.quantity.toString() : "0");
    setPrice("1");
    setTotalPrice("0");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenMakeOfferModel]);

  useEffect(() => {
    const qtyNum = Number.parseFloat(quantity) || 0;
    const priceNum = Number.parseFloat(price) || 0;
    setTotalPrice((qtyNum * priceNum).toFixed(4));
  }, [price, quantity, isOpenMakeOfferModel]);

  useEffect(() => {
    const qtyNum = Number.parseFloat(quantity) || 0;
    setIsValidQuantity(
      qtyNum > 0 && qtyNum <= (Number(listedNFTData?.quantity.toString()) || 0)
    );
  }, [quantity, listedNFTData]);

  useEffect(() => {
    const priceNum = Number.parseFloat(price) || 0;
    setIsValidPrice(priceNum > 0);
  }, [price]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleMakeOffer = async () => {
    setLoading(true);
    if (step === 1 && isValidQuantity && isValidPrice) {
      setStep(2);
      setLoading(false);
    } else if (step === 2) {
      try {
        if (
          !wallet ||
          !listedNFTData ||
          !listedNFTData.authority ||
          !listedNFTData.pda ||
          !publicKey
        ) {
          throw new Error("Invalid wallet or PDA");
        }
        console.log(listedNFTData.authority.toBase58());

        await makeOffer(
          listedNFTData.mint,
          listedNFTData.pda,
          listedNFTData.vaultAccount,
          listedNFTData.authority,
          connection,
          wallet,
          publicKey,
          quantity,
          price,
          listedNFTData.price,
          reFetch
        );
        setStep(1);
        setIsOpenMakeOfferModel(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleClose = () => {
    setStep(1);
    setIsOpenMakeOfferModel(false);
  };

  return (
    <Dialog open={isOpenMakeOfferModel} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-card-primary to-card-primary/90 border border-white/10 p-0 text-white rounded-xl overflow-hidden shadow-2xl w-[90vw] max-w-4xl sm:max-w-4xl ">
        <div className="relative flex justify-between items-center p-4 border-b border-white/10 bg-black/20">
          <h2 className="text-xl font-bold">
            {step === 1 ? "Make Offer" : "Confirm Offer"}
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
                <h3 className="text-lg font-semibold mb-4">Offer Details</h3>

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
                        type="text"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className={`input-box ${
                          !isValidQuantity && "error-input-box"
                        }`}
                        placeholder="Enter quantity"
                      />
                      {!isValidQuantity && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-white/60">
                      {!isValidQuantity ? (
                        <span className="text-red-400">
                          Invalid quantity. Maximum:{" "}
                          {listedNFTData?.quantity.toString()}
                        </span>
                      ) : (
                        `Available: ${listedNFTData?.quantity.toString()}`
                      )}
                    </p>
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
                        onChange={handlePriceChange}
                        type="text"
                        value={price}
                        className={`input-box  ${
                          !isValidPrice && "error-input-box"
                        }`}
                        placeholder="Enter price in SOL"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                        SOL
                      </div>
                    </div>
                    {!isValidPrice && (
                      <p className="text-xs text-red-400">
                        Please enter a valid price greater than 0
                      </p>
                    )}
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
                    {/* Todo : Fetch SOL Price in USD */}
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
                  Confirm Your Offer
                </h3>

                <div className="bg-black/30 p-4 rounded-lg space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">NFT</span>
                    <span className="font-semibold">{listedNFTData?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Quantity</span>
                    <span className="font-semibold">{quantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Price per NFT</span>
                    <span className="font-semibold">{price} SOL</span>
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
                    Make an offer for this NFT by locking your SOL securely. If
                    the seller accepts, the NFT is yours—otherwise, your SOL is
                    refunded. Place your bid now!
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
                className={cn(
                  "flex-1 bg-gradient-to-r from-light-button-gradient-start to-light-button-gradient-end hover:opacity-90 transition-all hover:cursor-pointer ",
                  (!isValidQuantity || !isValidPrice) &&
                    "opacity-50 cursor-not-allowed disabled:hover:cursor-not-allowed"
                )}
                disabled={!isValidQuantity || !isValidPrice || loading}
                onClick={handleMakeOffer}
              >
                {step === 1 ? (
                  "Continue"
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Offer{" "}
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

export default MakeOfferModel;
