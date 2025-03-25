import BuyNFTModel from "@/components/Listing/BuyNFTModel";
import CancelListingModel from "@/components/Listing/CancelListingModel";
import ListedNFT from "@/components/Listing/ListedNFT";
import UpdateListingPriceModel from "@/components/Listing/UpdateListingPriceModel";

import React from "react";

function page() {
  return (
    <div className="p-4">
      <BuyNFTModel />
      <CancelListingModel />
      <UpdateListingPriceModel />
      <ListedNFT />
    </div>
  );
}

export default page;
