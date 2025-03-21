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

export const buyNft = async (
  mintAddress: string | PublicKey,
  pda: string | PublicKey,
  vault: string | PublicKey,
  authority: string | PublicKey,
  connection: Connection,
  wallet: AnchorWallet,
  publicKey: PublicKey,
  quantity: string,
  price: string
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
    console.log("🚀 ~ TokenCard ~ recipientATA:", recipientATA.toBase58());

    const tx = await program.methods
      .buyNft(new BN(Number(quantity)), new BN(Number(price)))
      .accounts({
        buyer: publicKey,
        owner: new PublicKey(authority),
        config: new PublicKey(pda),
        mint: new PublicKey(mintAddress),
        vaultTokenAccount: new PublicKey(vault),
        buyerTokenAccount: recipientATA,
        treasury: new PublicKey(authority),
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc({ commitment: "confirmed" });
    if (tx) {
      toast.success("NFT bought successfully");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};
