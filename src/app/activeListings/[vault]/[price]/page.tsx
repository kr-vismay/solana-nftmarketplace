import SingleNFTDetails from "@/components/ActiveListings/SingleNFT/SingleNFTDetails";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function page({ params }: { params: any }) {
  const { price, vault } = params;

  return <SingleNFTDetails price={price} vault={vault} isMyNFT={true} />;
}

export default page;
