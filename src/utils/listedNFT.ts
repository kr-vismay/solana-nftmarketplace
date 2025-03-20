import { AnchorProvider, Program } from "@project-serum/anchor";
import IDL from "@/IDL/nftmarketplace.json";
import { TConfig } from "@/types/listedNFT";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { getNFTMetaData } from "./getNFTMetaData";

export const listedNFT = async (
  connection: Connection,
  wallet: AnchorWallet,
  publicKey: PublicKey
) => {
  try {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });

    const program = new Program(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      IDL as any,
      process.env.NEXT_PUBLIC_PROGRAM_ID!,
      provider
    );

    const data = (await program.account.config.all()) as TConfig[];

   
    const processNFTs = async (isOwner: boolean) => {
      const filteredNFTs = data
        .filter(
          (item) =>
            item.account.authority.equals(publicKey) === isOwner &&
            Array.isArray(item.account.nfts) &&
            item.account.nfts.length > 0
        )
        .flatMap((item) =>
          item.account.nfts.map((nft) => ({
            ...nft,
            pda: item.account.pda,
            authority: item.account.authority,
          }))
        );

      // Fetch metadata for all NFTs concurrently
      return Promise.all(
        filteredNFTs.map(async (nft) => {
          const metadata = await getNFTMetaData(new PublicKey(nft.mint));
          return {
            ...nft,
            name: metadata.data.name,
            image: metadata.data.image,
            symbol: metadata.data.symbol,
          };
        })
      );
    };

    const [filteredNFTsForSpecificUser, filteredNFTsForGeneralUser] =
      await Promise.all([processNFTs(true), processNFTs(false)]);

    return {
      success: true,
      filteredNFTsForGeneralUser,
      filteredNFTsForSpecificUser,
    };
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return {
      success: false,
      filteredNFTsForGeneralUser: [],
      filteredNFTsForSpecificUser: [],
    };
  }
};
