import GeneralNFTDetails from "@/components/Discover/GeneralNFTDetails";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function page({ params }: { params: any }) {
  const { price, vault } = params;
  return <GeneralNFTDetails price={price} vault={vault} isMyNFT={false} />;
}

export default page;
