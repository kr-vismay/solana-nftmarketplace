import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
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
import { initializeUser } from "./initializeUser";
import IDL from "@/IDL/nftmarketplace.json";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
export const sellNft = async (
  connection: Connection,
  wallet: AnchorWallet,
  publicKey: PublicKey,
  mintAddress: string,
  senderTokenAccount: string,
  quantity: string,
  price: string
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
  try {
    await initializeUser(connection, publicKey, wallet);
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });

    const program = new Program(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      IDL as any,
      process.env.NEXT_PUBLIC_PROGRAM_ID,
      provider
    );

    const vaultTokenAccount = await getAssociatedTokenAddress(
      new PublicKey(mintAddress),
      pda,
      true, // PDA has no private key
      TOKEN_2022_PROGRAM_ID
    );

    const vaultTokenAccountInfo = await connection.getAccountInfo(
      vaultTokenAccount
    );

    const transaction = new Transaction();

    if (vaultTokenAccountInfo === null) {
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        publicKey, // Payer
        vaultTokenAccount, // Associated Token Account
        pda, // Owner
        new PublicKey(mintAddress), // Mint Address
        TOKEN_2022_PROGRAM_ID // Token Program
      );
      transaction.add(createATAInstruction);
      await provider.sendAndConfirm(transaction);
    }
    const tx = await program.methods
      .sellNft(new BN(quantity), new BN(price))
      .accounts({
        signer: publicKey,
        config: pda,
        mint: new PublicKey(mintAddress),
        senderTokenAccount: new PublicKey(senderTokenAccount),
        vaultTokenAccount: vaultTokenAccount,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc({ commitment: "confirmed", preflightCommitment: "confirmed" });
    if (tx) {
      toast.success("NFT listed successfully");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};
