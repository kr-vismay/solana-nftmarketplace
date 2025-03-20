import { TNFTData } from "@/types/fetchedNFT";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface IMenuActions {
  setISOpen: (_value: boolean) => void;
  setNFTData: (_value: TNFTData) => void;
}

export interface IMenuValues {
  isOpen: boolean;
  NFTData: TNFTData;
}

const initialMenuStoreValue: IMenuValues = {
  isOpen: false,
  NFTData: {
    balance: "",
    mintAddress: "",
    mintAuthority: "",
    tokenAccount: "",
    uiAmount: 0,
    name: "",
    image: "",
    symbol: "",
  },
};

export const useDashboardMenuStore = create<
  IMenuValues & IMenuActions,
  [["zustand/immer", never], ["zustand/subscribeWithSelector", never]]
>(
  immer(
    subscribeWithSelector((set) => ({
      ...initialMenuStoreValue,
      setISOpen: (value: boolean) =>
        set((state) => {
          state.isOpen = value;
        }),
      setNFTData: (value: TNFTData) =>
        set((state) => {
          state.NFTData = value;
        }),
    }))
  )
);
