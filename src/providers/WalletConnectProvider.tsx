"use client";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  const endpoint = clusterApiUrl("devnet");
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect wallets={wallets}>
        <WalletModalProvider>
          {children}
          <ToastContainer />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default WalletConnectProvider;
