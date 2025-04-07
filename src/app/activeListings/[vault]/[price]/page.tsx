import SingleNFTDetails from "@/components/ActiveListings/SingleNFT/SingleNFTDetails";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function page({ params }: { params: any }) {
  const { price, vault } = params;

  return (
    <div className="max-w-[1440px] mx-auto px-4 pb-4">
      <SingleNFTDetails price={price} vault={vault} isMyNFT={true} />;
    </div>
  );
}

export default page;
