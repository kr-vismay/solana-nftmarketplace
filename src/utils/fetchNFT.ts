import { TNFTData } from "@/types/fetchedNFT";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getNFTMetaData } from "./getNFTMetaData";

export const fetchNFT = async (publicKey: PublicKey) => {
  if (publicKey) {
    try {
      const connection = new Connection(clusterApiUrl("devnet"));

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: TOKEN_2022_PROGRAM_ID,
        }
      );

      const filteredTokens = tokenAccounts.value.filter(
        (token) =>
          token.account.data.parsed.info.tokenAmount.decimals === 0 &&
          token.account.data.parsed.info.tokenAmount.amount > 0
      );

      const NFTData = await Promise.all(
        filteredTokens.map(async (token) => {
          const mintAddress = token.account.data.parsed.info.mint;

          const mintInfo = await connection.getParsedAccountInfo(
            new PublicKey(mintAddress)
          );

          return {
            mintAddress,
            balance: token.account.data.parsed.info.tokenAmount.amount,
            name: await getNFTMetaData(mintAddress).then((res) => {
              return res.data.name;
            }),
            symbol: await getNFTMetaData(mintAddress).then((res) => {
              return res.data.symbol;
            }),
            image: await getNFTMetaData(mintAddress).then((res) => {
              return res.data.image;
            }),
            tokenAccount: token.pubkey.toString(),

            mintAuthority:
              mintInfo.value?.data.parsed?.info?.mintAuthority || null,
          };
        })
      );

      return { success: true, data: NFTData as TNFTData[] };
    } catch {
      return { success: false, data: [] };
    }
  }
};
