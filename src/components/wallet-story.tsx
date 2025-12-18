import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/lib/types";
import { StatsCard } from "./stats-card";
import { CalendarDays, Repeat, Wallet, Activity, Copy, Share2, Download, User, Pencil } from "lucide-react";
import { Separator } from "./ui/separator";
import { TooltipProvider } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Badge } from "./ui/badge";

type WalletStoryProps = {
  result: AnalysisResult;
  onReset: () => void;
  address: string;
};

export function WalletStory({ result, onReset }: WalletStoryProps) {
    const { toast } = useToast();
    const { personalityData } = result;

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
          title: "Copied to clipboard!",
        });
      };
    
    if (!personalityData) {
        return (
            <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16 text-center">
                <h2 className="text-2xl font-bold">Analysis Incomplete</h2>
                <p className="mt-2 text-muted-foreground">Could not generate a personality for this wallet.</p>
                <Button onClick={onReset} size="lg" className="mt-6">Analyze Another Wallet</Button>
            </div>
        )
    }

    const shareCardCopy = `${personalityData.personalityTitle}\n${personalityData.oneLineSummary}\n\nTraits:\n- ${personalityData.traits.join('\n- ')}`;
    const fullStoryText = `${shareCardCopy}\n\n${personalityData.personalityStory}`;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16 animate-in fade-in duration-500">
        <TooltipProvider>
            <div className="space-y-10">
                <header className="text-center space-y-4">
                    <h1 className="text-4xl font-headline font-bold text-foreground animate-in fade-in slide-in-from-bottom-3 duration-700">
                        {personalityData.personalityTitle}
                    </h1>
                    <p className="text-xl text-muted-foreground font-light animate-in fade-in slide-in-from-bottom-3 duration-700" style={{animationDelay: '150ms'}}>
                        {personalityData.oneLineSummary}
                    </p>
                </header>

                <div className="bg-card border rounded-lg p-6 space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{animationDelay: '200ms'}}>
                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-headline font-semibold">Personality Traits</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {personalityData.traits.map((trait, index) => (
                            <Badge key={index} variant="secondary" className="text-base px-4 py-2 transform transition-transform hover:scale-105 animate-in fade-in zoom-in-95 duration-300" style={{animationDelay: `${300 + index * 100}ms`}}>{trait}</Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{animationDelay: '400ms'}}>
                    <div className="flex items-center gap-3">
                        <Pencil className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-headline font-semibold">Personality Story</h3>
                    </div>
                    <div className="prose prose-lg dark:prose-invert text-foreground/90 max-w-none">
                        <p className="whitespace-pre-wrap font-body leading-relaxed">
                            {personalityData.personalityStory}
                        </p>
                    </div>
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
                        style={{animationDelay: '500ms'}}
                    />
                    <StatsCard
                        title="Total Transactions"
                        value={result.stats.txCount}
                        icon={Repeat}
                        className="animate-in fade-in-0 zoom-in-95 duration-500"
                        style={{animationDelay: '600ms'}}
                    />
                    <StatsCard
                        title="ETH Balance"
                        value={`${result.stats.balance} ETH`}
                        icon={Wallet}
                        className="animate-in fade-in-0 zoom-in-95 duration-500"
                        style={{animationDelay: '700ms'}}
                    />
                    <StatsCard
                        title="Activity"
                        value={result.stats.activityStatus}
                        icon={Activity}
                        className="animate-in fade-in-0 zoom-in-95 duration-500"
                        style={{animationDelay: '800ms'}}
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
                            <DropdownMenuItem onClick={() => handleCopyToClipboard(shareCardCopy)}>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Copy Share Text</span>
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
