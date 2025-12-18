import { forwardRef } from "react";
import { AnalysisResult } from "@/lib/types";
import { StatsCard } from "./stats-card";
import { CalendarDays, Repeat, Wallet, Activity, User, Pencil } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Icons } from "./icons";

type ShareCardProps = {
  result: AnalysisResult;
  address: string;
};

// Using forwardRef to pass the ref to the div
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ result, address }, ref) => {
    const { personalityData, stats } = result;
    const generationDate = new Date().toLocaleDateString();
    const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

    return (
      // This div is what will be captured for the PDF.
      // It's positioned off-screen and not visible to the user.
      <div
        ref={ref}
        className="fixed -left-[9999px] top-0 w-[800px] bg-background text-foreground p-10 font-body"
        style={{ colorScheme: "dark" }}
      >
        <div className="border rounded-lg p-8 space-y-8 h-full bg-card">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icons.logo className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-headline font-bold">
                Wallet Story Explorer
              </h1>
            </div>
            <div className="text-right">
                <p className="font-mono text-lg">{truncatedAddress}</p>
                <p className="text-sm text-muted-foreground">Wallet Address</p>
            </div>
          </header>

          <Separator />

          <main className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-headline font-bold text-primary">
                {personalityData.personalityTitle}
              </h2>
              <p className="text-lg text-muted-foreground">
                {personalityData.oneLineSummary}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-headline font-semibold">
                  Personality Traits
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {personalityData.traits.map((trait, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-base px-4 py-2"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Pencil className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-headline font-semibold">
                  Personality Story
                </h3>
              </div>
              <div className="text-foreground/90" style={{ lineHeight: 1.7 }}>
                <p>{personalityData.personalityStory}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <StatsCard
                title="Wallet Age"
                value={`${stats.walletAge} days`}
                icon={CalendarDays}
              />
              <StatsCard
                title="Total Transactions"
                value={stats.txCount}
                icon={Repeat}
              />
              <StatsCard
                title="ETH Balance"
                value={`${stats.balance} ETH`}
                icon={Wallet}
              />
              <StatsCard
                title="Activity"
                value={stats.activityStatus}
                icon={Activity}
              />
            </div>
          </main>

          <Separator />

          <footer className="text-center text-sm text-muted-foreground">
            <p>
              Generated on {generationDate} from{" "}
              <a href="https://wallet-story-explorer.web.app" className="text-primary hover:underline">
                wallet-story-explorer.web.app
              </a>
            </p>
          </footer>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = "ShareCard";
