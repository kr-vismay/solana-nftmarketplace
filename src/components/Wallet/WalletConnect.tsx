"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WalletName } from "@solana/wallet-adapter-base";
import { Wallet } from "lucide-react";

//handle wallet balance fixed to 2 decimal numbers without rounding
export function toFixed(num: number, fixed: number): string {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)![0];
}

const WalletConnection = () => {
  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect, connecting, wallet } =
    useWallet();

  const [open, setOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [balance, setBalance] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userWalletAddress, setUserWalletAddress] = useState<string>("");

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info?.lamports / LAMPORTS_PER_SOL);
      }
    });
  }, [publicKey, connection]);

  useEffect(() => {
    setUserWalletAddress(publicKey?.toBase58() as string);
  }, [publicKey]);

  const handleWalletSelect = async (walletName: WalletName) => {
    if (walletName) {
      try {
        select(walletName);
        setOpen(false);
      } catch (error) {
        console.log("wallet connection err : ", error);
      }
    }
  };

  const handleDisconnect = async () => {
    disconnect();
  };

  const handleCahngeAccount = () => {
    setOpen(true);
  };

  return (
    <div className="text-white">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex gap-2 items-center">
          {!publicKey ? (
            <>
              <DialogTrigger asChild>
                <button className="px-5 py-2  rounded-full font-semibold z-50 bg-gradient-to-r from-button-gradient-start to-button-gradient-end">
                  {connecting ? "connecting..." : "Connect Wallet"}
                </button>
              </DialogTrigger>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="ring-0 focus:ring-0 outline-none focus:outline-none"
              >
                <button className="px-3 sm:px-5 py-2  rounded-full  bg-gradient-to-r from-button-gradient-start to-button-gradient-end text-white font-semibold text-sm sm:text-lg z-50 flex items-center gap-1">
                  {wallet && (
                    <Image
                      src={wallet.adapter.icon}
                      alt="icon"
                      width={20}
                      height={20}
                      className="h-5 w-5 sm:h-6 sm:w-6"
                    />
                  )}

                  {publicKey.toBase58().slice(0, 3) +
                    "..." +
                    publicKey.toBase58().slice(-3)}
                  <Wallet />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className=" bg-card-primary border-none rounded-lg w-fit mt-1 flex flex-col gap-2 p-3 shadow-md">
                <DropdownMenuItem className="flex justify-center hover:bg-none p-0 rounded-lg">
                  <Button
                    className="z-50 text-lg text-white bg-transparent w-full hover:bg-content-hover"
                    onClick={handleCahngeAccount}
                  >
                    Change wallet
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-center hover:bg-none p-0 rounded-lg">
                  <Button
                    className="z-50 text-lg text-white bg-transparent w-full hover:bg-content-hover"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DialogContent
            className=" bg-card-primary border-none shadow-card-drop overflow-auto px-10 sm:py-5 py-3"
            style={{
              borderRadius: "24px",
              scrollbarWidth: "none",
            }}
          >
            <div className="flex flex-col gap-5">
              <div className="text-white font-bold text-2xl">
                Wallet Connect
              </div>
              <div className="flex flex-col gap-2">
                {wallets.map((Wallet) => (
                  <button
                    key={Wallet.adapter.name}
                    onClick={() => handleWalletSelect(Wallet.adapter.name)}
                    className={`flex gap-4 w-full items-center p-3 hover:bg-content-hover rounded-lg ${
                      Wallet.adapter.name === wallet?.adapter.name &&
                      "bg-selected-content hover:bg-content-hover"
                    } `}
                  >
                    <Image
                      src={Wallet.adapter.icon}
                      alt={Wallet.adapter.name}
                      height={30}
                      width={30}
                      className="sm:h-[25px] sm:w-[25px]  h-[23px] w-[23px]"
                    />
                    <div className="font-slackey text-white wallet-name text-[13px] sm:text-[15px]">
                      {Wallet.adapter.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default WalletConnection;
