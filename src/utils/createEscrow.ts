import { AnchorProvider, Program } from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";

import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import IDL from "@/IDL/nftmarketplace.json";
import { AnchorWallet } from "@solana/wallet-adapter-react";
export const createEscrow = async (
  connection: Connection,
  publicKey: PublicKey,
  wallet: AnchorWallet
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
    [Buffer.from("escrow", "utf-8"), publicKey.toBuffer()],
    new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID)
  );

  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  const program = new Program(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IDL as any,
    process.env.NEXT_PUBLIC_PROGRAM_ID,
    provider
  );

  try {
    await program.methods
      .createEscrowFormakeoffer()
      .accounts({
        escrowPda: escrow,
        initializer: publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  } catch (error) {
    console.log("🚀 ~ initializeNFTPDA ~ error:", error);
  }
};
