import { TListedNFT } from "@/types/listedNFT";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface IMenuActions {
  setISOpenBuyModel: (_value: boolean) => void;
  setListedNFTData: (_value: TListedNFT) => void;
  setIsOpenCancelModel: (_value: boolean) => void;
  setIsOpenUpdatePriceModel: (_value: boolean) => void;
  setIsOpenMakeOfferModel: (_value: boolean) => void;
}

export interface IMenuValues {
  isOpenBuyModel: boolean;
  listedNFTData: TListedNFT | null;
  isOpenCancelModel: boolean;
  isOpenUpdatePriceModel: boolean;
  isOpenMakeOfferModel: boolean;
}

const initialMenuStoreValue: IMenuValues = {
  isOpenBuyModel: false,
  listedNFTData: null,
  isOpenCancelModel: false,
  isOpenUpdatePriceModel: false,
  isOpenMakeOfferModel: false,
};

export const useListingStore = create<
  IMenuValues & IMenuActions,
  [["zustand/immer", never], ["zustand/subscribeWithSelector", never]]
>(
  immer(
    subscribeWithSelector((set) => ({
      ...initialMenuStoreValue,
      setISOpenBuyModel: (value: boolean) =>
        set((state) => {
          state.isOpenBuyModel = value;
        }),
      setListedNFTData: (value: TListedNFT) =>
        set((state) => {
          state.listedNFTData = value;
        }),
      setIsOpenCancelModel: (value: boolean) =>
        set((state) => {
          state.isOpenCancelModel = value;
        }),
      setIsOpenUpdatePriceModel: (value: boolean) =>
        set((state) => {
          state.isOpenUpdatePriceModel = value;
        }),
      setIsOpenMakeOfferModel: (value: boolean) =>
        set((state) => {
          state.isOpenMakeOfferModel = value;
        }),
    }))
  )
);

useListingStore.subscribe((state) => console.log(state));
