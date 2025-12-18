import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/lib/types";
import { PersonalityBadge } from "./personality-badge";
import { StatsCard } from "./stats-card";
import { CalendarDays, Repeat, Wallet, Activity, Copy, Share2, Download } from "lucide-react";
import { Separator } from "./ui/separator";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

type WalletStoryProps = {
  result: AnalysisResult;
  onReset: () => void;
  address: string;
};

function formatAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletStory({ result, onReset, address }: WalletStoryProps) {
    const { toast } = useToast();

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
          title: "Copied to clipboard!",
        });
      };
    
    const storyParagraphs = result.story.split('\n').filter(p => p.trim().length > 0);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16 animate-in fade-in duration-500">
        <TooltipProvider>
            <div className="space-y-10">
                <PersonalityBadge personality={result.personality} />

                <div className="prose prose-lg dark:prose-invert mx-auto text-foreground/90">
                {storyParagraphs.map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-wrap font-body leading-relaxed animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{animationDelay: `${100 * index}ms`}}>
                        {paragraph.includes(address) ? (
                            <>
                                {paragraph.split(address)[0]}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="font-mono text-primary cursor-pointer" onClick={() => handleCopyToClipboard(address)}>
                                            {formatAddress(address)}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Click to copy full address</p>
                                    </TooltipContent>
                                </Tooltip>
                                {paragraph.split(address)[1]}
                            </>
                        ) : (
                            paragraph
                        )}
                    </p>
                ))}
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
                    className="animate-in fade-in-0 zoom-in-95 duration-500"
                    style={{animationDelay: '100ms'}}
                />
                <StatsCard
                    title="Total Transactions"
                    value={result.stats.txCount}
                    icon={Repeat}
                    className="animate-in fade-in-0 zoom-in-95 duration-500"
                    style={{animationDelay: '200ms'}}
                />
                <StatsCard
                    title="ETH Balance"
                    value={`${result.stats.balance} ETH`}
                    icon={Wallet}
                    className="animate-in fade-in-0 zoom-in-95 duration-500"
                    style={{animationDelay: '300ms'}}
                />
                <StatsCard
                    title="Activity"
                    value={result.stats.activityStatus}
                    icon={Activity}
                    className="animate-in fade-in-0 zoom-in-95 duration-500"
                    style={{animationDelay: '400ms'}}
                />
                </div>

                <div className="flex justify-center items-center gap-4 pt-6">
                    <Button onClick={onReset} size="lg">Analyze Another Wallet</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg">
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleCopyToClipboard(result.story)}>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Copy Story Text</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert("PDF Download coming soon!")}>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download as PDF</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
      </TooltipProvider>
    </div>
  );
}
