"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDashboardMenuStore } from "@/store/Dashboard";
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
import { sellNft } from "@/utils/sellNFT";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { createEscrow } from "@/utils/createEscrow";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { initializeUser } from "@/utils/initializeUser";
import { toast } from "react-toastify";

function NFTInfoModal({ refetch }: { refetch: () => void }) {
  const [isOpen, setIsOpen, NFTData] = useDashboardMenuStore(
    useShallow((state) => [state.isOpen, state.setISOpen, state.NFTData])
  );

  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("1");
  const [totalPrice, setTotalPrice] = useState("0");
  const [isValidQuantity, setIsValidQuantity] = useState(true);
  const [isValidPrice, setIsValidPrice] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();

  useEffect(() => {
    setQuantity("1");
    setPrice("1");
    setTotalPrice("0");
  }, [isOpen]);

  useEffect(() => {
    const qtyNum = Number.parseFloat(quantity) || 0;
    const priceNum = Number.parseFloat(price) || 0;
    setTotalPrice((qtyNum * priceNum).toFixed(4));
  }, [quantity, price, isOpen]);

  useEffect(() => {
    const qtyNum = Number.parseFloat(quantity) || 0;
    setIsValidQuantity(qtyNum > 0 && qtyNum <= (Number(NFTData?.balance) || 0));
  }, [quantity, NFTData, step]);

  useEffect(() => {
    const priceNum = Number.parseFloat(price) || 0;
    setIsValidPrice(priceNum > 0);
  }, [price, step]);

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

  const checkIntialization = async () => {
    if (!publicKey || !connection || !process.env.NEXT_PUBLIC_PROGRAM_ID)
      return;
    const [escrow] = findProgramAddressSync(
      [Buffer.from("escrow", "utf-8"), publicKey.toBuffer()],
      new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID)
    );

    const [pda] = findProgramAddressSync(
      [Buffer.from("config", "utf-8"), publicKey.toBuffer()],
      new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID)
    );

    const isUserInitializedPDA = await connection.getAccountInfo(pda);
    const isUserInitializedEscrow = await connection.getAccountInfo(escrow);

    if (isUserInitializedEscrow && isUserInitializedPDA) {
      setStep(2);
    }
  };

  useEffect(() => {
    checkIntialization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, connection, isOpen]);

  const handleInitialize = async () => {
    try {
      setLoading(true);
      await initializeUser(
        connection,
        publicKey as PublicKey,
        wallet as AnchorWallet
      );
      await createEscrow(
        connection,
        publicKey as PublicKey,
        wallet as AnchorWallet
      );
      setStep(2);
      toast.success("User initialized successfully");
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while initializing user");
      setLoading(false);
    }
  };

  const handleSellNFT = async () => {
    setLoading(true);
    if (step === 2 && isValidQuantity && isValidPrice) {
      setStep(3);
      setLoading(false);
    } else if (step === 3) {
      await sellNft(
        connection,
        wallet as AnchorWallet,
        publicKey as PublicKey,
        NFTData?.mintAddress,
        NFTData?.tokenAccount,
        quantity,
        price
      );
      setStep(1);
      setLoading(false);
      refetch();
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-card-primary to-card-primary/90 border border-white/10 p-0 text-white rounded-xl overflow-hidden shadow-2xl w-[90vw] max-w-4xl sm:max-w-4xl ">
        <div className="relative flex justify-between items-center p-4 border-b border-white/10 bg-black/20">
          <h2 className="text-xl font-bold">
            {step === 1
              ? "Initialize Account"
              : step === 2
              ? "Sell Your NFT"
              : "Confirm Listing"}
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
          <ArrowRight className="w-4 h-4 text-white/50" />
          <Badge
            variant={step === 3 ? "outline" : "default"}
            className="bg-selected-content text-white"
          >
            3
          </Badge>
        </div>
        <div className="relative flex sm:flex-row flex-col w-full h-[470px] overflow-auto mb-4">
          <div className="flex flex-col gap-4 sm:border-r border-white/10 p-5 sm:w-2/5">
            <div className="relative">
              <Image
                src={NFTData.image}
                alt={NFTData.name || "NFT"}
                width={500}
                height={500}
                className="object-cover rounded-xl aspect-square w-full"
              />
              <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm">
                {NFTData.symbol}
              </Badge>
            </div>

            <h3 className="text-white font-bold text-2xl mt-2 flex items-center gap-2">
              {NFTData.name}
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Wallet className="w-4 h-4" />
                <span>
                  Balance:{" "}
                  <span className="font-bold text-white">
                    {NFTData.balance}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="sm:w-3/5 p-5 flex flex-col">
            {step === 1 ? (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  Initialize your account
                </h3>
                <div className="mt-4 bg-black/30 p-4 rounded-lg">
                  Initialize your account to start selling NFTs. This process is
                  quick and easy. Once your account is initialized, you can
                  start listing your NFTs for sale.
                </div>
              </>
            ) : step === 2 ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Listing Details</h3>

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
                          Invalid quantity. Maximum: {NFTData.balance}
                        </span>
                      ) : (
                        `Available: ${NFTData.balance}`
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
                        type="text"
                        value={price}
                        onChange={handlePriceChange}
                        className={`input-box ${
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
                  Confirm Your Listing
                </h3>

                <div className="bg-black/30 p-4 rounded-lg space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">NFT</span>
                    <span className="font-semibold">{NFTData.name}</span>
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
                    Your NFTs will be listed on the marketplace immediately
                    after confirmation. You can cancel your listing at any time.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {step === 3 && (
                <Button
                  variant="outline"
                  disabled={loading}
                  className="flex-1 border-white/20 bg-outline-button-background hover:bg-outline-button-background hover:text-white text-white hover:cursor-pointer"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
              )}
              {step === 1 && (
                <Button
                  onClick={handleInitialize}
                  className={cn(
                    " flex-1 bg-gradient-to-r from-light-button-gradient-start to-light-button-gradient-end hover:opacity-90  transition-all hover:cursor-pointer ",
                    loading &&
                      "opacity-50 cursor-not-allowed disabled:hover:cursor-not-allowed"
                  )}
                  disabled={loading}
                >
                  <span className="flex items-center gap-2">
                    Initialize Account
                    {loading && <Loader className="animate-spin ml-2" />}
                  </span>
                </Button>
              )}
              {step !== 1 && (
                <Button
                  className={cn(
                    "flex-1 bg-gradient-to-r from-light-button-gradient-start to-light-button-gradient-end hover:opacity-90 transition-all hover:cursor-pointer ",
                    (!isValidQuantity || !isValidPrice) &&
                      "opacity-50 cursor-not-allowed disabled:hover:cursor-not-allowed"
                  )}
                  disabled={!isValidQuantity || !isValidPrice || loading}
                  onClick={handleSellNFT}
                >
                  {step === 2 ? (
                    "Continue"
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Listing{" "}
                      {loading && <Loader className="animate-spin ml-2" />}
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NFTInfoModal;
