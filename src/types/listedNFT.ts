import { PublicKey } from "@solana/web3.js";

export interface TOffer {
  buyer: PublicKey;
  buyerTokenAccount: PublicKey;
  price: string;
  quantity: string;
}

export interface TListedNFT {
  price: string;
  quantity: string;
  vaultAccount: PublicKey | string;
  mint: PublicKey | string;
  pda?: PublicKey;
  authority?: PublicKey;
  name?: string;
  image?: string;
  symbol?: string;
  offers: TOffer[];
}

interface TAccount {
  authority: PublicKey;
  pda: PublicKey;
  nfts: TListedNFT[];
}

export interface TConfig {
  publicKey: PublicKey;
  account: TAccount;
}
