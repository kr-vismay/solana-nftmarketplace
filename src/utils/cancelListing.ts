import { AnchorProvider, Program } from "@project-serum/anchor";
import IDL from "@/IDL/nftmarketplace.json";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export const cancelListing = async (
  mintAddress: string | PublicKey,
  pda: PublicKey,
  vault: string | PublicKey,
  authority: PublicKey,
  senderATA: PublicKey,
  connection: Connection,
  wallet: AnchorWallet,
  publicKey: PublicKey
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tx = await program.methods
      .cancelListing(mintAddress.toString())
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
  } catch (error) {
    console.log(error);
  }
};
