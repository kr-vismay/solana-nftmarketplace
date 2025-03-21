import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import IDL from "@/IDL/nftmarketplace.json";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";

export const cancelListing = async (
  mintAddress: string | PublicKey,
  pda: PublicKey,
  vault: string | PublicKey,
  authority: PublicKey,
  senderATA: PublicKey,
  connection: Connection,
  wallet: AnchorWallet,
  publicKey: PublicKey,
  price: string
) => {
  try {
    if (!process.env.NEXT_PUBLIC_PROGRAM_ID) {
      throw Error("Missing required parameters");
    }
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
      .cancelListing(mintAddress.toString(), new BN(Number(price)))
      .accounts({
        buyer: publicKey,
        owner: new PublicKey(authority),
        config: new PublicKey(pda),
        mint: new PublicKey(mintAddress),
        vaultTokenAccount: new PublicKey(vault),
        sellerTokenAccount: senderATA,
        treasury: new PublicKey(authority),
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc({ commitment: "confirmed" });
    if (tx) {
      toast.success("Listing cancelled successfully");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};
