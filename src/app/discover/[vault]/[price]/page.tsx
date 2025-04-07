import GeneralNFTDetails from "@/components/Discover/GeneralNFTDetails";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function page({ params }: { params: any }) {
  const { price, vault } = params;
  return (
    <div className="max-w-[1440px] mx-auto px-4 pb-4">
      <GeneralNFTDetails price={price} vault={vault} isMyNFT={false} />;
    </div>
  );
}

export default page;
