import GeneralNFTDetails from "@/components/Discover/GeneralNFTDetails";
import React from "react";

function page({ params }: { params: { vault: string; price: string } }) {
  const { price, vault } = params;
  return <GeneralNFTDetails price={price} vault={vault} isMyNFT={false} />;
}

export default page;
