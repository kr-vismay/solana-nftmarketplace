"use client";
import React from "react";
import { Badge } from "../ui/badge";
import nft from "../../../public/nft.avif";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Thumbnail() {
  const router = useRouter();
  return (
    <div className="flex lg:flex-row flex-col h-fit items-center lg:gap-0 gap-10 mt-5">
      <div className="flex flex-col w-full lg:w-[50%] text-white font-bold text-[30px] sm:text-[35px] md:text-[40px] lg:text-[56px] justify-center text-center lg:text-left">
        <span>Discover</span>
        <span>Collect, & Sell</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end">
          Extraordinary
        </span>
        <span>NFTs</span>
        <div className="flex flex-col gap-3 items-center lg:items-start">
          <p className="text-sm font-normal text-white/50">
            Experience seamless NFT trading on the Solana blockchain with fast,
            low-cost transactions. Buy, sell, and make offers on exclusive
            digital assets effortlessly.
          </p>
          <button
            className="bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end px-4 py-3 rounded-lg cursor-pointer text-sm w-fit"
            onClick={() => router.push("/createNFT")}
          >
            Create Your NFT
          </button>
        </div>
      </div>

      <div className="lg:w-[50%] w-full relative flex justify-center items-center">
        <div className="absolute w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] border border-white/40 rounded-xl overflow-hidden rotate-6">
          <div className="bg-card-primary py-2 px-4 flex justify-between items-center">
            <span className="font-bold text-white">FROGANA</span>
          </div>
          <div className="relative w-full h-full">
            <Image
              src={nft}
              alt="NFT"
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
            <Badge className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm md:text-base text-sm">
              FG
            </Badge>
          </div>
        </div>

        <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] border border-white/40 rounded-xl overflow-hidden z-10 rotate-[-6deg]">
          <div className="bg-card-primary py-2 px-4 flex justify-between items-center">
            <span className="font-bold text-white">FROGANA</span>
          </div>
          <div className="relative w-full h-full">
            <Image
              src={nft}
              alt="NFT"
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
            <Badge className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm md:text-base text-sm">
              FG
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Thumbnail;
