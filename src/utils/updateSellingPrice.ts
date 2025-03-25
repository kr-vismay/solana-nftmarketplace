import { AnchorProvider, BN, Program } from "@project-serum/anchor";

import { Connection, PublicKey } from "@solana/web3.js";

import IDL from "@/IDL/nftmarketplace.json";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
export const updateSellingPrice = async (
  connection: Connection,
  wallet: AnchorWallet,
  publicKey: PublicKey,
  vaultTokenAccount: PublicKey,
  pda: PublicKey,
  old_price: string,
  new_price: string
) => {
  if (
    !connection ||
    !publicKey ||
    !wallet ||
    !process.env.NEXT_PUBLIC_PROGRAM_ID
  ) {
    throw Error("Missing required parameters");
  }

  try {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });

    const program = new Program(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      IDL as any,
      process.env.NEXT_PUBLIC_PROGRAM_ID,
      provider
    );

    const tx = await program.methods
      .updatePrice(new BN(old_price), new BN(new_price))
      .accounts({
        vaultTokenAccount: vaultTokenAccount,
        owner: publicKey,
        config: pda,
      })
      .rpc({ commitment: "confirmed", preflightCommitment: "confirmed" });
    if (tx) {
      toast.success("Updated successfully");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};
