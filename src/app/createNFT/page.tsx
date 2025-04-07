import NFTForm from "@/components/CreateNFT/NftForm";
import React from "react";

export default function page() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 pb-4">
      <div className="p-4">
        <NFTForm />
      </div>
    </div>
  );
}
