import SingleNFTDetails from "@/components/ActiveListings/SingleNFT/SingleNFTDetails";
import React from "react";

function page({ params }: { params: { vault: string; price: string } }) {
  const { price, vault } = params;

  return <SingleNFTDetails price={price} vault={vault} isMyNFT={true} />;
}

export default page;
