
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/lib/types";
import { StatsCard } from "./stats-card";
import { CalendarDays, Repeat, Wallet, Activity, Copy, Share2, Download, User, Pencil, Search, Link as LinkIcon, Camera, ChevronDown } from "lucide-react";
import { Separator } from "./ui/separator";
import { TooltipProvider } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
  } from "@/components/ui/dropdown-menu"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { Badge } from "./ui/badge";
import { ShareCard } from "./share-card";
import { useState, useRef } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import html2canvas from "html2canvas";
import { Twitter } from "lucide-react";
import { track } from "@/lib/analytics";
import { Timeline } from "./timeline";
import { Badges } from "./badges";

type WalletStoryProps = {
  result: AnalysisResult;
  onReset: () => void;
  address: string;
};

export function WalletStory({ result, onReset, address }: WalletStoryProps) {
    const { toast } = useToast();
    const { personalityData, timelineEvents, badges } = result;
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [isDownloadingPng, setIsDownloadingPng] = useState(false);
    const [isTimelineOpen, setIsTimelineOpen] = useState(false);
    const shareCardRef = useRef<HTMLDivElement>(null);


    const handleCopyToClipboard = (text: string, successMessage: string = "Copied to clipboard!") => {
        navigator.clipboard.writeText(text);
        toast({
          title: successMessage,
        });
      };
    
    const handleDownloadPdf = async () => {
        track('click_download_pdf', { address });
        if (!shareCardRef.current) return;
        setIsDownloadingPdf(true);
        try {
          const canvas = await html2canvas(shareCardRef.current, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            backgroundColor: null,
          });
    
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [canvas.width, canvas.height],
          });
    
          pdf.addImage(canvas.toDataURL("image/png", 1.0), "PNG", 0, 0, canvas.width, canvas.height);
          
          const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
          pdf.save(`wallet-story-${truncatedAddress}.pdf`);

          toast({
            title: "Success!",
            description: "PDF downloaded successfully.",
          });
          track('download_pdf_success', { address });

        } catch (error) {
          console.error("Failed to download PDF", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to generate PDF. Please try again.",
          });
          track('download_pdf_failed', { address, error: error instanceof Error ? error.message : String(error) });
        } finally {
          setIsDownloadingPdf(false);
        }
      };
    
    const handleDownloadPng = async () => {
      track('click_download_png', { address });
      if (!shareCardRef.current) return;
      setIsDownloadingPng(true);

      try {
        const dataUrl = await toPng(shareCardRef.current, { 
            cacheBust: true, 
            quality: 0.95,
            pixelRatio: 2,
        });
        const link = document.createElement("a");
        const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
        link.download = `wallet-story-${truncatedAddress}.png`;
        link.href = dataUrl;
        link.click();
        
        toast({
            title: "Success!",
            description: "PNG Image downloaded successfully.",
        });
        track('download_png_success', { address });

      } catch (err) {
        console.error("Failed to download PNG", err);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to generate image. Please try again.",
          });
        track('download_png_failed', { address, error: err instanceof Error ? err.message : String(err) });
      } finally {
        setIsDownloadingPng(false);
      }
    };


    if (!personalityData) {
        return (
            <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16 text-center">
                <h2 className="text-2xl font-bold">Analysis Incomplete</h2>
                <p className="mt-2 text-muted-foreground">Could not generate a personality for this wallet.</p>
                <Button onClick={onReset} size="lg" className="mt-6">
                    <Search className="mr-2" />
                    Analyze Another Wallet
                </Button>
            </div>
        )
    }

    const shareCardCopy = `I just discovered my wallet personality: The ${personalityData.personalityTitle} 🎭\n\nCheck out yours at ${window.location.origin}`;
    
    const shareOnTwitter = () => {
        track('click_share_twitter', { address });
        const text = encodeURIComponent(`I just discovered my wallet personality: The ${personalityData.personalityTitle} 🎭\n\nCheck out yours at`);
        const url = encodeURIComponent(`${window.location.origin}?address=${address}`);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        window.open(twitterUrl, "_blank");
    }

    const copyLink = () => {
        track('click_copy_link', { address });
        const url = `${window.location.origin}?address=${address}`;
        handleCopyToClipboard(url, "Link copied to clipboard!");
    }
    
    const copyShareText = () => {
        track('click_copy_share_text', { address });
        handleCopyToClipboard(shareCardCopy, "Share text copied!");
    }


  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16 animate-in fade-in duration-500">
        <ShareCard ref={shareCardRef} result={result} address={address} />
        <TooltipProvider>
            <div className="space-y-10">
                <header className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground tracking-wide animate-in fade-in slide-in-from-bottom-3 duration-700">
                        {personalityData.personalityTitle}
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground font-light animate-in fade-in slide-in-from-bottom-3 duration-700" style={{animationDelay: '150ms'}}>
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
                        <p className="whitespace-pre-wrap font-body" style={{lineHeight: 1.75}}>
                            {personalityData.personalityStory}
                        </p>
                    </div>
                </div>
                
                {badges && badges.length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{animationDelay: '500ms'}}>
                            <h3 className="text-lg font-headline font-semibold text-center">Achievements ({badges.length})</h3>
                            <Badges badges={badges} />
                        </div>
                    </>
                )}


                {result.limitedData && (
                <p className="text-center text-sm text-muted-foreground">
                    Note: Limited data was available, so this story might not be complete.
                </p>
                )}
                
                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {timelineEvents && timelineEvents.length > 0 && (
                  <>
                    <Separator />
                    <Collapsible
                        open={isTimelineOpen}
                        onOpenChange={setIsTimelineOpen}
                        className="w-full space-y-6"
                    >
                        <CollapsibleTrigger asChild>
                            <button className="w-full flex justify-center items-center gap-2 text-lg font-headline font-semibold hover:text-primary transition-colors">
                                View Journey
                                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isTimelineOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                            <Timeline events={timelineEvents} />
                        </CollapsibleContent>
                    </Collapsible>
                  </>
                )}

                <div className="flex justify-center items-center gap-4 pt-6">
                    <Button onClick={onReset} size="lg">
                        <Search className="mr-2 h-4 w-4" />
                        Analyze Another
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg">
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={copyLink}>
                                <LinkIcon className="mr-2 h-4 w-4" />
                                <span>Copy Link</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={copyShareText}>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Copy Share Text</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={shareOnTwitter}>
                                <Twitter className="mr-2 h-4 w-4" />
                                <span>Share on Twitter</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg" disabled={isDownloadingPng || isDownloadingPdf}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleDownloadPng} disabled={isDownloadingPng}>
                                {isDownloadingPng ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </div>
                                ) : (
                                    <>
                                        <Camera className="mr-2 h-4 w-4" />
                                        <span>Image (PNG)</span>
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownloadPdf} disabled={isDownloadingPdf}>
                                {isDownloadingPdf ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </div>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" />
                                        <span>PDF</span>
                                    </>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
      </TooltipProvider>
    </div>
  );
}
