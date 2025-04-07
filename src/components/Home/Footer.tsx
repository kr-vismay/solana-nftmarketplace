"use client";
import { Facebook, Github, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import React from "react";
import SolanaLogo from "../../../public/Solana_logo.png";
import { useRouter } from "next/navigation";
function Footer() {
  const router = useRouter();
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 text-white gap-7 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 hover:cursor-pointer">
          <Image src={SolanaLogo} width={35} height={35} alt="logo" />
          <span className="font-extrabold text-2xl ">SolanaVerse</span>
        </div>
        <p>
          Discover, collect, and sell extraordinary NFTs on Solana&apos;s
          fastest growing marketplace.
        </p>
        <div className="flex gap-4">
          <Github />
          <Instagram />
          <Twitter />
          <Facebook />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-bold text-2xl">Quick Links</span>
        <div className="flex flex-col gap-2">
          <span
            className="hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            Home
          </span>
          <span
            className="hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            Dashboard
          </span>
          <span
            className="hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            Create NFT
          </span>
          <span
            className="hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            Discover
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-bold text-2xl">Resources</span>
        <div className="flex flex-col gap-2">
          <span
            className="hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            Help Center
          </span>
          <span
            className="hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            Platform Status
          </span>
          <span
            className="hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            Blogs
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-bold text-2xl">Stay in the loop</span>
        <p>
          Join our mailing list to stay in the loop with our newest feature
          releases, NFT drops, and tips and tricks for navigating SolanaVerse.
        </p>
      </div>
    </div>
  );
}

export default Footer;
