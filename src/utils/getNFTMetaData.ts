import { getTokenMetadata } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export const getNFTMetaData = async (mintAddress: PublicKey) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"));
    const NFT = await getTokenMetadata(connection, new PublicKey(mintAddress))
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
    if (NFT) {
      const res = await fetch(NFT?.uri);
      const metaData = await res.json();
      return { success: true, data: metaData };
    } else {
      return { success: false, data: null };
    }
  } catch {
    return { success: false, data: null };
  }
};
