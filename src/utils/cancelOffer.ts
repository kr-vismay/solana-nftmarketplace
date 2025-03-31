import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";

import IDL from "@/IDL/nftmarketplace.json";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
export const cancelOffer = async (
  connection: Connection,
  wallet: AnchorWallet,
  publicKey: PublicKey,
  config: PublicKey,
  vaultTokenAccount: PublicKey,
  price: string,
  offerIndex: number
) => {
  if (
    !connection ||
    !publicKey ||
    !wallet ||
    !process.env.NEXT_PUBLIC_PROGRAM_ID
  ) {
    throw Error("Missing required parameters");
  }

  const [escrow] = findProgramAddressSync(
    [],
    new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID)
  );
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
      .cancelOffer(new BN(Number(offerIndex)), new BN(price))
      .accounts({
        buyer: publicKey,
        escrowPda: escrow,
        config: config,
        vaultTokenAccount: vaultTokenAccount,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc({ commitment: "confirmed", preflightCommitment: "confirmed" });
    if (tx) {
      toast.success("Offer Cancelled");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};
