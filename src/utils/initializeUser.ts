import { AnchorProvider, Program } from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";

import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import IDL from "@/IDL/nftmarketplace.json";
import { AnchorWallet } from "@solana/wallet-adapter-react";
export const initializeUser = async (
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

  const [pda] = findProgramAddressSync(
    [Buffer.from("config", "utf-8"), publicKey?.toBuffer()],
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
    await program.account.config.fetch(pda);
  } catch (error) {
    console.log("🚀 ~ initializeNFTPDA ~ error:", error);
    await program.methods
      .initialize()
      .accounts({
        signer: publicKey,
        config: pda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }
};
