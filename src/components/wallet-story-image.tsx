
import { forwardRef } from "react";
import { AnalysisResult } from "@/lib/types";
import { Icons } from "./icons";
import { Badge } from "./ui/badge";
import { CalendarDays, Repeat } from "lucide-react";

type WalletStoryImageProps = {
  result: AnalysisResult;
  address: string;
};

// Fixed size for social media card (1080x1080)
const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1080;

export const WalletStoryImage = forwardRef<HTMLDivElement, WalletStoryImageProps>(
  ({ result, address }, ref) => {
    const { personalityData, stats } = result;
    const truncatedAddress = `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;

    return (
      <div
        ref={ref}
        className="fixed -left-[9999px] top-0 font-body"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          backgroundColor: "#111115", // Dark background
          color: "#E5E7EB", // Light text
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        <div className="h-full w-full flex flex-col p-16 justify-between">
          {/* Header */}
          <header className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Icons.logo className="h-10 w-10 text-purple-500" />
              <h1
                className="text-2xl font-bold tracking-wider"
              >
                Wallet Story
              </h1>
            </div>
            <div className="text-right">
                <p className="font-mono text-xl">{truncatedAddress}</p>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex flex-col items-center justify-center text-center -mt-16 space-y-10">
            <h2 className="text-7xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              {personalityData.personalityTitle}
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl">
              {personalityData.oneLineSummary}
            </p>
            <div className="flex gap-4">
              {personalityData.traits.map((trait, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xl px-6 py-3 bg-gray-800/70 border-gray-700"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </main>
          
          {/* Footer */}
          <footer className="w-full flex items-end justify-between">
            <div className="flex gap-12">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-lg text-gray-400">Wallet Age</p>
                  <p className="text-3xl font-bold">{stats.walletAge} days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Repeat className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-lg text-gray-400">Transactions</p>
                  <p className="text-3xl font-bold">{stats.txCount}</p>
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-500">wallet-summary.vercel.app</p>
          </footer>
        </div>
      </div>
    );
  }
);

WalletStoryImage.displayName = "WalletStoryImage";
