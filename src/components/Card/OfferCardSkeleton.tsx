import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";

function OfferCardSkeleton() {
  return (
    <Card className="flex flex-col  bg-gradient-to-br from-card-primary to-card-primary/90 border border-white/10  text-white rounded-xl  gap-4 shadow-[inset_0px_0px_7px_0px_#d6bcfa] animate-pulse">
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-2">
            <span className="text-base font-medium text-white">
              Wallet Address
            </span>
            <span className="bg-[#ab80b7]/50 py-3  rounded-lg px-4"></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/50">
            <div className="bg-[#ab80b7]/50 py-3  rounded-lg px-4 w-full"></div>
          </div>
        </div>

        <hr className="border-white/40" />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-base font-medium text-white">Price</div>
            <div className="bg-[#ab80b7]/50 py-3  rounded-lg px-4 w-full"></div>
          </div>
          <div className="space-y-1">
            <div className="text-base font-medium text-white">Quantity</div>
            <div className="bg-[#ab80b7]/50 py-3  rounded-lg px-4 w-full"></div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <button className="w-full bg-gradient-to-tr from-light-button-gradient-start to-light-button-gradient-end py-4 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"></button>
      </CardFooter>
    </Card>
  );
}

export default OfferCardSkeleton;
