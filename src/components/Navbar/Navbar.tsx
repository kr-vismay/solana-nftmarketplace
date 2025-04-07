"use client";

import Image from "next/image";
import React, { useState } from "react";
import SolanaLogo from "../../../public/Solana_logo.png";
import WalletConnection from "../Wallet/WalletConnect";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

function Navbar() {
  const NAVBARdATA = [
    { id: "1", name: "Create-nft", href: "/createNFT", label: "createNFT" },
    { id: "2", name: "Dashboard", href: "/dashboard", label: "dashboard" },
    {
      id: "3",
      name: "ActiveListings",
      href: "/activeListings",
      label: "activeListings",
    },
    { id: "4", name: "Discover", href: "/discover", label: "discover" },
  ];
  const [open, setOpen] = useState<boolean>(false);
  const path = usePathname();
  const router = useRouter();
  return (
    <div className="flex items-center justify-between bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end sm:p-4 p-3 rounded-bl-4xl rounded-tr-4xl text-white  max-w-[1440px] mx-auto shadow-[0px_2px_18px_0px_#805ad5]">
      <div
        className="flex items-center gap-2 hover:cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image src={SolanaLogo} width={40} height={40} alt="logo" />
        <span className="font-extrabold sm:block hidden text-3xl ">
          SolanaVerse
        </span>
      </div>
      <div className="hidden lg:flex items-center gap-4">
        {NAVBARdATA.map((nav) => (
          <Link
            href={nav.href}
            key={nav.id}
            className={`font-semibold text-lg  rounded-b-md ${
              path.split("/")[1] === nav.label
                ? "border-b-2 text-button-gradient-start border-b-button-gradient-start"
                : ""
            } `}
          >
            {nav.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center">
        <WalletConnection />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <button className="p-2">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-card-primary text-white p-0 w-[80%] border-l-0"
          >
            <div className="flex flex-col h-full">
              <div className="flex gap-2 items-center p-4 border-b border-white/10">
                <Image src={SolanaLogo} width={40} height={40} alt="logo" />
                <span className="font-extrabold text-2xl">NFT Marketplace</span>
              </div>

              <div className="flex flex-col p-4 space-y-4 ">
                {NAVBARdATA.map((nav) => (
                  <Link
                    href={nav.href}
                    key={nav.id}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "font-semibold text-lg py-2 px-4 rounded-md hover:bg-content-hover",
                      path.split("/")[1] === nav.label ? "bg-content-hover" : ""
                    )}
                  >
                    {nav.name}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default Navbar;
