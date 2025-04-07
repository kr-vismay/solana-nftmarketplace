import {
  Brush,
  Edit,
  ListChecks,
  ShoppingCart,
  Tag,
  XCircle,
} from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

function Features() {
  const features = [
    {
      icon: <Brush className="h-8 w-8 text-white/50" />,
      title: "Create & Mint NFT",
      description:
        "Upload your artwork, set properties, and mint your NFT directly on the Solana blockchain with low gas fees.",
    },
    {
      icon: <ListChecks className="h-8 w-8 text-white/50" />,
      title: "List NFT",
      description:
        "Set your price and instantly list your NFT on the marketplace for potential buyers to discover.",
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-white/50" />,
      title: "Buy NFT",
      description:
        "Browse, discover and purchase NFTs with a simple one-click transaction using SOL or supported SPL tokens.",
    },
    {
      icon: <Edit className="h-8 w-8 text-white/50" />,
      title: "Modify Listed NFT",
      description:
        "Update the price or terms of your listed NFT at any time to respond to market conditions.",
    },
    {
      icon: <XCircle className="h-8 w-8 text-white/50" />,
      title: "Cancel Listing",
      description:
        "Remove your NFT from the marketplace at any time with no penalties or additional fees.",
    },
    {
      icon: <Tag className="h-8 w-8 text-white/50" />,
      title: "Make Offer",
      description:
        "Negotiate directly with NFT owners by making custom offers, even for items not currently listed.",
    },
  ];
  return (
    <div>
      <h1 className=" text-white font-bold text-[25px] sm:text-[35px] md:text-[40px] lg:text-[56px] text-center">
        Powerful NFT Trading Features
      </h1>
      <p className="text-sm sm:text-base font-normal text-white/50 text-center">
        Everything you need to create, buy, sell, and trade Solana NFTs in one
        seamless platform
      </p>
      <div className="mx-auto grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-card-primary border-white/10 text-white rounded-xl shadow-[inset_0px_0px_7px_0px_#d6bcfa] cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <CardHeader>
              <div className="p-2 rounded-lg w-fit bg-selected-content mb-4">
                {feature.icon}
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/50 text-base">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Features;
