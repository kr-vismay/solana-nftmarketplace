"use client";
import { FileQuestion } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

function NoNFTfound() {
  const router = useRouter();
  const path = usePathname();
  return (
    <div className="sm:p-4 ">
      <div className="flex flex-col justify-center items-center max-w-[500px] mx-auto  bg-gradient-to-br from-card-primary to-card-primary/90 border border-white/10  text-white rounded-xl md:p-6 p-4 shadow-[inset_0px_0px_7px_0px_#d6bcfa] gap-6">
        <FileQuestion size={100} />
        <div className="text-2xl font-bold">NFT Not Found</div>
        {path === "/dashboard" ? (
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end px-4 py-3 rounded-lg cursor-pointer"
          >
            Create Your NFT
          </button>
        ) : (
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end px-4 py-3 rounded-lg cursor-pointer"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default NoNFTfound;
