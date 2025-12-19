
import { forwardRef } from "react";
import { AnalysisResult } from "@/lib/types";
import { Icons } from "./icons";
import { Badge } from "./ui/badge";
import { CalendarDays, Repeat, Wallet, Activity } from "lucide-react";
import { StatsCard } from "./stats-card";

type WalletStoryExportProps = {
  result: AnalysisResult;
  address: string;
};

// Fixed size for a high-quality export, can be scaled down.
const CARD_WIDTH = 1080;

export const WalletStoryExport = forwardRef<HTMLDivElement, WalletStoryExportProps>(
  ({ result, address }, ref) => {
    const { personalityData, stats, badges } = result;
    const truncatedAddress = `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;

    return (
      <div
        ref={ref}
        className="font-body"
        style={{
          position: 'fixed',
          top: '0',
          left: '-9999px',
          width: CARD_WIDTH,
          minHeight: 1350,
          backgroundColor: "#0b0b10",
          color: "#E5E7EB",
          fontFamily: "'Space Grotesk', sans-serif",
          zIndex: -1,
        }}
      >
        <div className="h-full w-full flex flex-col p-16 justify-between gap-12">
          {/* Header */}
          <header className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <Icons.logo className="h-12 w-12 text-purple-500" />
              <h1 className="text-3xl font-bold tracking-wider">
                Wallet Story
              </h1>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl">{truncatedAddress}</p>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex flex-col items-center justify-center text-center space-y-10">
            <h2 className="text-8xl font-bold tracking-tight text-white">
              {personalityData.personalityTitle}
            </h2>
            <p className="text-3xl text-gray-400 max-w-4xl">
              {personalityData.oneLineSummary}
            </p>
            <div className="flex gap-4">
              {personalityData.traits.map((trait, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-2xl px-8 py-4 bg-gray-800/70 border-gray-700"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </main>

          {/* Story */}
           <div className="space-y-4 text-left">
              <h3 className="text-2xl font-bold border-b border-gray-700 pb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Personality Story</h3>
              <div className="text-xl text-gray-300 leading-relaxed space-y-4">
                {personalityData.personalityStory.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
             <StatsCard title="Wallet Age" value={`${stats.walletAge} days`} icon={CalendarDays} className="bg-gray-800/50 border-gray-700" />
             <StatsCard title="Transactions" value={stats.txCount} icon={Repeat} className="bg-gray-800/50 border-gray-700" />
             <StatsCard title="ETH Balance" value={`${parseFloat(stats.balance).toFixed(4)} ETH`} icon={Wallet} className="bg-gray-800/50 border-gray-700" />
             <StatsCard title="Activity" value={stats.activityStatus} icon={Activity} className="bg-gray-800/50 border-gray-700" />
          </div>

          {/* Achievements */}
           {badges && badges.length > 0 && (
              <div className="space-y-6 pt-4">
                <h3 className="text-2xl font-bold border-b border-gray-700 pb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Achievements ({badges.length})
                </h3>
                <ul className="list-disc list-inside space-y-3 text-lg">
                  {badges.map((badge) => (
                    <li key={badge.id}>
                      <span className="font-semibold text-purple-400">{badge.name} ({badge.rarity}):</span> <span className="text-gray-400">{badge.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          
          {/* Footer */}
          <footer className="w-full flex items-center justify-center text-center pt-8 border-t border-gray-800">
            <p className="text-xl text-gray-500">wallet-summary.vercel.app</p>
          </footer>
        </div>
      </div>
    );
  }
);

WalletStoryExport.displayName = "WalletStoryExport";
