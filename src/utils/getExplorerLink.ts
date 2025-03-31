export const getExplorerLink = (addressOrTx: string, cluster: string) => {
  const explorerUrl = `https://explorer.solana.com/address/${addressOrTx}?cluster=${cluster}`;
  return explorerUrl;
};
