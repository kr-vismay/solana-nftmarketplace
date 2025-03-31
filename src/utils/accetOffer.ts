import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";

import IDL from "@/IDL/nftmarketplace.json";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { TOffer } from "@/types/listedNFT";
export const acceptOffer = async (
  connection: Connection,
  wallet: AnchorWallet,
  publicKey: PublicKey,
  buyerATA: PublicKey,
  vaultTokenAccount: PublicKey,
  mintAddress: string,
  price: string,
  offerIndex: number,
  Offers: TOffer[],
  buyer: PublicKey
) => {
  if (
    !connection ||
    !publicKey ||
    !wallet ||
    !process.env.NEXT_PUBLIC_PROGRAM_ID
  ) {
    throw Error("Missing required parameters");
  }
  const [pda] = findProgramAddressSync(
    [Buffer.from("config", "utf-8"), publicKey?.toBuffer()],
    new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID)
  );

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
    console.log(
      `seller: ${publicKey.toBase58()} config:${pda.toBase58()}  mint: ${mintAddress.toString()} vault: ${vaultTokenAccount.toString()} buyerATA: ${buyerATA.toString()} price: ${price.toString()}`
    );
    const formattedAccounts = Offers.filter(
      (offer) => offer.buyer.toBase58() !== buyer.toBase58()
    ).map((offer) => ({
      pubkey: new PublicKey(offer.buyer.toBase58()),
      isWritable: true,
      isSigner: false,
    }));

    const tx = await program.methods
      .acceptOffer(new BN(Number(offerIndex)), new BN(price))
      .accounts({
        seller: publicKey,
        escrowPda: escrow,
        config: pda,
        vaultTokenAccount: vaultTokenAccount,
        buyerTokenAccount: buyerATA,
        mint: new PublicKey(mintAddress),
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts(formattedAccounts)
      .rpc({ commitment: "confirmed", preflightCommitment: "confirmed" });
    if (tx) {
      toast.success("Offer Accepted");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};
