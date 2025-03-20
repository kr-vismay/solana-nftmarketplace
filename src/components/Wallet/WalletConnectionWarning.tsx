import React from "react";
import WalletConnection from "./WalletConnect";

function WalletConnectionWarning() {
  return (
    <div className="text-white flex justify-center items-center flex-col gap-6 ">
      <div className="text-2xl sm:text-3xl font-bold">
        Please Connect Wallet
      </div>
      <WalletConnection />
    </div>
  );
}

export default WalletConnectionWarning;
