
import { forwardRef } from "react";
import { AnalysisResult } from "@/lib/types";
import { Icons } from "./icons";

type WalletStoryPdfProps = {
  result: AnalysisResult;
  address: string;
};

// A4 dimensions in pixels at 96 DPI: 794x1123
// We will use this as a base and let jsPDF scale it.
const A4_WIDTH = 794;

export const WalletStoryPDF = forwardRef<HTMLDivElement, WalletStoryPdfProps>(
  ({ result, address }, ref) => {
    const { personalityData, stats, badges } = result;
    const generationDate = new Date().toLocaleDateString();
    const truncatedAddress = `${address.substring(0, 10)}...${address.substring(
      address.length - 8
    )}`;

    return (
      <div
        ref={ref}
        className="fixed -left-[9999px] top-0 font-body"
        style={{
          width: A4_WIDTH,
          background: "#ffffff",
          color: "#111111",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div className="p-12 space-y-8">
          {/* Header */}
          <header className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <Icons.logo className="h-8 w-8 text-purple-600" />
              <h1
                className="text-xl font-bold"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Wallet Story Report
              </h1>
            </div>
            <div className="text-right">
              <p className="text-base font-mono">{truncatedAddress}</p>
              <p className="text-xs text-gray-500">
                Generated on {generationDate}
              </p>
            </div>
          </header>

          <main className="space-y-8">
            {/* Personality Title & Summary */}
            <div className="text-center space-y-2">
              <h2
                className="text-4xl font-bold text-purple-700"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {personalityData.personalityTitle}
              </h2>
              <p className="text-lg text-gray-600">
                {personalityData.oneLineSummary}
              </p>
            </div>
            
            {/* Traits */}
            <div className="space-y-3">
                 <h3 className="text-lg font-bold border-b pb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Personality Traits</h3>
                 <p className="text-base text-gray-700">{personalityData.traits.join(" • ")}</p>
            </div>


            {/* Story */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold border-b pb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Personality Story</h3>
              <div className="text-base text-gray-800 leading-relaxed space-y-4">
                {personalityData.personalityStory.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold border-b pb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Key Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Wallet Age</p>
                        <p className="text-2xl font-bold">{stats.walletAge} days</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Transactions</p>
                        <p className="text-2xl font-bold">{stats.txCount}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">ETH Balance</p>
                        <p className="text-2xl font-bold">{parseFloat(stats.balance).toFixed(4)} ETH</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Activity</p>
                        <p className="text-2xl font-bold">{stats.activityStatus}</p>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            {badges && badges.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold border-b pb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Achievements ({badges.length})
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {badges.map((badge) => (
                    <li key={badge.id} className="text-base">
                      <span className="font-semibold">{badge.name} ({badge.rarity}):</span> {badge.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="text-center text-xs text-gray-500 pt-8 border-t border-gray-200">
            <p>
              Generated by{" "}
              <span className="font-semibold text-purple-700">
                wallet-summary.vercel.app
              </span>
            </p>
          </footer>
        </div>
      </div>
    );
  }
);

WalletStoryPDF.displayName = "WalletStoryPDF";
