"use client";

import type React from "react";

import { useMemo, useState } from "react";
import axios from "axios";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  getMintLen,
  ExtensionType,
  TYPE_SIZE,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMetadataPointerInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Loader } from "lucide-react";
import Image from "next/image";
import FormSideImage from "../../../public/formSide.avif";
import { Input } from "../ui/input";
import WalletConnectionWarning from "../Wallet/WalletConnectionWarning";
export default function NFTForm() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    totalSupply: "",
    description: "",
    image: "",
  });
  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() !== "" &&
      formData.symbol.trim() !== "" &&
      formData.totalSupply.trim() !== "" &&
      formData.image &&
      formData.description.trim() !== ""
    );
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const imageURL = await uploadImagetoPinata(file);
      setFormData((prev) => ({ ...prev, image: imageURL ? imageURL : "" }));
    }
  };

  const uploadImagetoPinata = async (file: File) => {
    if (file) {
      try {
        setImageUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const metadata = JSON.stringify({
          name: "File name",
        });
        formData.append("pinataMetadata", metadata);
        const res = await axios({
          method: "POST",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key:
              process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });
        const ImageHash = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
        return ImageHash;
      } catch (error) {
        console.log(error);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const uploadMetadata = async () => {
    const { name, symbol, image, description } = formData;
    if (name && symbol && image && description) {
      try {
        const metadata = JSON.stringify({
          name,
          symbol,
          description,
          image,
        });

        const metadataResponse = await axios({
          method: "POST",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key:
              process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
            "Content-Type": "application/json",
          },
          data: metadata,
        });
        const metadataHash = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;
        return metadataHash;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const creatAndmintNFT = async () => {
    setLoading(true);
    if (!publicKey || !signTransaction) {
      console.log("Connect your wallet.");
      return;
    }

    try {
      const mint = Keypair.generate();
      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadata: TokenMetadata = {
        mint: mint.publicKey,
        name: formData.name,
        symbol: formData.symbol,
        uri: (await uploadMetadata()) ?? "",
        additionalMetadata: [["creator", `${publicKey.toBase58()}`]],
      };

      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
      const mintLamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      );

      // Create ATA with proper parameters
      const tokenATA = await getAssociatedTokenAddress(
        mint.publicKey,
        publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const mintTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mint.publicKey,
          space: mintLen,
          lamports: mintLamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          mint.publicKey,
          publicKey,
          mint.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          mint.publicKey,
          0,
          publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ),

        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mint.publicKey,
          metadata: mint.publicKey,
          name: formData.name,
          symbol: formData.symbol,
          uri: (await uploadMetadata()) ?? "",
          mintAuthority: publicKey,
          updateAuthority: publicKey,
        }),
        createAssociatedTokenAccountInstruction(
          publicKey,
          tokenATA,
          publicKey,
          mint.publicKey,
          TOKEN_2022_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        ),
        createMintToInstruction(
          mint.publicKey,
          tokenATA,
          publicKey,
          Number(formData.totalSupply) * Math.pow(10, Number("0")),
          [],
          TOKEN_2022_PROGRAM_ID
        ),

        createUpdateFieldInstruction({
          metadata: mint.publicKey,
          programId: TOKEN_2022_PROGRAM_ID,
          updateAuthority: publicKey,
          field: metadata.additionalMetadata[0][0],
          value: metadata.additionalMetadata[0][1],
        })
      );

      mintTransaction.feePayer = publicKey;
      mintTransaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      mintTransaction.partialSign(mint);
      const signedTx = await signTransaction(mintTransaction);
      const txId = await connection.sendRawTransaction(signedTx.serialize());
      console.log("Token Created and Minted. Transaction ID:", txId);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(txId);
      if (confirmation.value.err) throw new Error("Transaction failed");
      toast.success("NFT Created and Minted");
      setFormData({
        name: "",
        symbol: "",
        totalSupply: "",
        image: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating token:", error);
      setFormData({
        name: "",
        symbol: "",
        totalSupply: "",
        image: "",
        description: "",
      });
      toast.error("Error creating NFT");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return publicKey ? (
    <div className="flex w-full max-w-[1300px] mx-auto  rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] relative overflow-hidden mt-5 ">
      <div className=" p-6 w-[100%] md:w-[50%] bg-gradient-to-tr from-[#7e3b9a] via-[#500a76] to-[#955ca8] z-40 ">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">NFT Details</h2>
        </div>

        <div className="space-y-6">
          <div className="flex sm:flex-row flex-col  sm:items-center sm:gap-2 gap-6 justify-between">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name" className="text-white">
                NFT Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="NFT Name"
                className="input-box"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="symbol" className="text-white">
                NFT Symbol
              </label>
              <Input
                id="symbol"
                name="symbol"
                type="text"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="NFT Symbol"
                className="input-box"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="totalSupply" className="text-white">
              Total Supply
            </label>
            <Input
              id="totalSupply"
              name="totalSupply"
              type="number"
              value={formData.totalSupply}
              onChange={handleChange}
              placeholder="Total Supply"
              className="input-box"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="image" className="text-white">
              NFT Image
            </label>
            <div
              className="border-2 border-dashed border-white/55 rounded-lg p-6 text-center bg-cover bg-center bg-no-repeat "
              style={{
                backgroundImage: `url(${formData.image})`,
              }}
            >
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>

                <button
                  type="button"
                  disabled={imageUploading}
                  onClick={() => document.getElementById("image")?.click()}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-button-gradient-start to-button-gradient-end text-white text-sm flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  Select File
                  {imageUploading && <Loader className="ml-2 animate-spin" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="description "
              rows={4}
              className="input-box rounded-md border p-3 min-h-[50px]"
            ></textarea>
          </div>

          <button
            type="submit"
            onClick={creatAndmintNFT}
            disabled={loading || !isFormValid}
            className="w-full px-4 py-3 bg-gradient-to-r from-button-gradient-start to-button-gradient-end text-white font-medium rounded-md flex items-center justify-center focus:outline-none focus:ring-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create NFT {loading && <Loader className="ml-2 animate-spin" />}
          </button>
        </div>
      </div>
      <div className="w-[100%] absolute h-full md:block hidden">
        <Image
          src={FormSideImage}
          alt="sideImage"
          width={600}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  ) : (
    <WalletConnectionWarning />
  );
}
