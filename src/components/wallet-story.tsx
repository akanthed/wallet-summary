import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/lib/types";
import { PersonalityBadge } from "./personality-badge";
import { StatsCard } from "./stats-card";
import { CalendarDays, Repeat, Wallet, Activity } from "lucide-react";
import { Separator } from "./ui/separator";

type WalletStoryProps = {
  result: AnalysisResult;
  onReset: () => void;
};

export function WalletStory({ result, onReset }: WalletStoryProps) {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16 animate-in fade-in duration-500">
      <div className="space-y-10">
        <PersonalityBadge personality={result.personality} />

        <div className="prose prose-lg dark:prose-invert mx-auto text-foreground/90">
          <p className="whitespace-pre-wrap font-body leading-relaxed">{result.story}</p>
        </div>

        {result.limitedData && (
          <p className="text-center text-sm text-muted-foreground">
            Note: Limited data was available, so this story might not be complete.
          </p>
        )}
        
        <Separator />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatsCard
            title="Wallet Age"
            value={`${result.stats.walletAge} days`}
            icon={CalendarDays}
          />
          <StatsCard
            title="Total Transactions"
            value={result.stats.txCount}
            icon={Repeat}
          />
          <StatsCard
            title="ETH Balance"
            value={`${result.stats.balance} ETH`}
            icon={Wallet}
          />
          <StatsCard
            title="Activity"
            value={result.stats.activityStatus}
            icon={Activity}
          />
        </div>

        <div className="flex justify-center pt-6">
          <Button onClick={onReset} size="lg">Analyze Another Wallet</Button>
        </div>
      </div>
    </div>
  );
}
