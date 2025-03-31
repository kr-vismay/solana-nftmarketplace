import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import IDL from "@/IDL/nftmarketplace.json";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";

export const makeOffer = async (
  mintAddress: string | PublicKey,
  pda: string | PublicKey,
  vault: string | PublicKey,
  connection: Connection,
  wallet: AnchorWallet,
  publicKey: PublicKey,
  quantity: string,
  offerPrice: string,
  originalPrice: string
) => {
  if (!process.env.NEXT_PUBLIC_PROGRAM_ID) {
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
    const [escrow] = findProgramAddressSync(
      [],
      new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID)
    );

    const recipientATA = await getAssociatedTokenAddress(
      new PublicKey(mintAddress),
      publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    const recipientATAInfo = await connection.getAccountInfo(recipientATA);

    const transaction = new Transaction();

    if (recipientATAInfo === null) {
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        publicKey, // Payer
        recipientATA, // Associated Token Account
        publicKey, // Owner
        new PublicKey(mintAddress), // Mint Address
        TOKEN_2022_PROGRAM_ID // Token Program
      );
      transaction.add(createATAInstruction);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const txSignature = await provider.sendAndConfirm(transaction);
    }

    const tx = await program.methods
      .makeOffer(
        new BN(Number(offerPrice)),
        new BN(Number(quantity)),
        new BN(Number(originalPrice))
      )
      .accounts({
        buyer: publicKey,
        escrowPda: escrow,
        config: new PublicKey(pda),
        vaultTokenAccount: new PublicKey(vault),
        buyerTokenAccount: recipientATA,
        systemProgram: SystemProgram.programId,
      })
      .rpc({ commitment: "confirmed" });
    if (tx) {
      toast.success("Offer Created");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};
