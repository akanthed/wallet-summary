

import { Button } from "@/components/ui/button";
import { AnalysisResult, ImageFormat } from "@/lib/types";
import { StatsCard } from "./stats-card";
import { CalendarDays, Repeat, Wallet, Activity, Copy, Share2, User, Pencil, Search, Link as LinkIcon, ChevronDown, Twitter, Linkedin, Download, Image as ImageIcon, Square } from "lucide-react";
import { Separator } from "./ui/separator";
import { TooltipProvider } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { Badge } from "./ui/badge";
import { useState, useRef, useEffect } from "react";
import { track } from "@/lib/analytics";
import { Timeline } from "./timeline";
import { Badges } from "./badges";
import { WalletStoryExport } from "./wallet-story-export";
import { WalletStoryShareCard } from "./wallet-story-share-card";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


type WalletStoryProps = {
  result: AnalysisResult;
  onReset: () => void;
  address: string;
};

export function WalletStory({ result, onReset, address }: WalletStoryProps) {
    const { toast } = useToast();
    const { personalityData, timelineEvents, badges } = result;
    const [isTimelineOpen, setIsTimelineOpen] = useState(false);
    const [isExportingPng, setIsExportingPng] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [isExportingShareCard, setIsExportingShareCard] = useState(false);

    const exportRef = useRef<HTMLDivElement>(null);
    const shareCardRef = useRef<HTMLDivElement>(null);


    const handleCopyToClipboard = (text: string, successMessage: string = "Copied to clipboard!") => {
        navigator.clipboard.writeText(text);
        toast({
          title: successMessage,
        });
      };

    const generateFilename = (extension: 'pdf' | 'png') => {
        const date = new Date();
        const dateStr = `${date.toLocaleString('default', { month: 'short' })}-${date.getDate()}-${date.getFullYear()}`.toLowerCase();
        const personality = personalityData.personalityTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return `wallet-story-${personality}-${dateStr}.${extension}`;
    }

    /**
     * Safety check before export
     */
    const verifyExportReady = (): boolean => {
        const node = exportRef.current;
        if (!node) {
            console.error('[Export] Export ref not found');
            return false;
        }
        const textContent = node.innerText.trim();
        if (!textContent || textContent.length === 0) {
            console.error('[Export] Export container has no text content');
            return false;
        }
        console.log('[Export] Content verified, length:', textContent.length);
        return true;
    };

    /**
     * Export as PNG using html2canvas
     * Dark theme matching UI
     */
    const exportAsPNG = async () => {
        if (isExportingPng) return;
        setIsExportingPng(true);
        track('click_download_png', { address });

        try {
            if (!verifyExportReady()) {
                throw new Error('Export component not ready');
            }

            const node = exportRef.current!;
            
            // Temporarily move element into view for capture
            const originalStyle = node.style.cssText;
            node.style.position = 'absolute';
            node.style.left = '0';
            node.style.top = '0';
            node.style.zIndex = '9999';
            
            // Wait for render
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(node, {
                backgroundColor: '#09090b',
                scale: 2,
                useCORS: true,
                logging: false,
                width: 1080,
                height: node.scrollHeight,
                onclone: (clonedDoc) => {
                    const clonedNode = clonedDoc.getElementById('wallet-export-container');
                    if (clonedNode) {
                        clonedNode.style.position = 'static';
                        clonedNode.style.left = '0';
                        clonedNode.style.top = '0';
                    }
                }
            });

            // Restore original position
            node.style.cssText = originalStyle;

            // Convert to PNG and download
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = generateFilename('png');
            link.href = dataUrl;
            link.click();
            link.remove();

            toast({
                title: "Success!",
                description: "Image downloaded successfully.",
            });
        } catch (error) {
            console.error('[Export PNG Error]', error);
            toast({
                title: "Export Failed",
                description: error instanceof Error ? error.message : "Failed to generate image. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsExportingPng(false);
        }
    };

    /**
     * Export as PDF using html2canvas + jsPDF
     * Dark theme matching UI
     */
    const exportAsPDF = async () => {
        if (isExportingPdf) return;
        setIsExportingPdf(true);
        track('click_download_pdf', { address });

        try {
            if (!verifyExportReady()) {
                throw new Error('Export component not ready');
            }

            const node = exportRef.current!;
            
            // Temporarily move element into view for capture
            const originalStyle = node.style.cssText;
            node.style.position = 'absolute';
            node.style.left = '0';
            node.style.top = '0';
            node.style.zIndex = '9999';
            
            // Wait for render
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(node, {
                backgroundColor: '#09090b',
                scale: 2,
                useCORS: true,
                logging: false,
                width: 1080,
                height: node.scrollHeight,
                onclone: (clonedDoc: Document) => {
                    const clonedNode = clonedDoc.getElementById('wallet-export-container');
                    if (clonedNode) {
                        clonedNode.style.position = 'static';
                        clonedNode.style.left = '0';
                        clonedNode.style.top = '0';
                    }
                }
            });

            // Restore original position
            node.style.cssText = originalStyle;

            const imgData = canvas.toDataURL('image/png', 1.0);

            // Create PDF and paginate the large canvas into A4-height slices
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // scale factor to fit canvas width to page width minus margins
            const margin = 20;
            const availableWidth = pageWidth - (margin * 2);
            const scale = availableWidth / imgWidth;

            // scaled full height in PDF units
            const fullPdfHeight = imgHeight * scale;

            // number of pages required
            const totalPages = Math.ceil(fullPdfHeight / pageHeight);

            // slice height in original canvas px for each PDF page
            const sliceHeight = Math.floor(pageHeight / scale);

            for (let page = 0; page < totalPages; page++) {
                const srcY = page * sliceHeight;
                const srcH = Math.min(sliceHeight, imgHeight - srcY);

                // create a temporary canvas to hold the slice
                const sliceCanvas = document.createElement('canvas');
                sliceCanvas.width = imgWidth;
                sliceCanvas.height = srcH;
                const ctx = sliceCanvas.getContext('2d');
                if (!ctx) throw new Error('Failed to create canvas context for PDF slice');

                ctx.drawImage(canvas, 0, srcY, imgWidth, srcH, 0, 0, imgWidth, srcH);

                const sliceData = sliceCanvas.toDataURL('image/png');
                const pdfSliceHeight = srcH * scale;

                pdf.addImage(sliceData, 'PNG', margin, margin, availableWidth, pdfSliceHeight);

                if (page < totalPages - 1) pdf.addPage();
            }

            pdf.save(generateFilename('pdf'));

            toast({
                title: "Success!",
                description: "PDF downloaded successfully.",
            });
        } catch (error) {
            console.error('[Export PDF Error]', error);
            toast({
                title: "Export Failed",
                description: error instanceof Error ? error.message : "Failed to generate PDF. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsExportingPdf(false);
        }
    };

    /**
     * Export square Share Card as PNG (1080x1080)
     * For social media sharing (X, LinkedIn, WhatsApp)
     */
    const exportShareCard = async () => {
        if (isExportingShareCard) return;
        setIsExportingShareCard(true);
        track('click_share_card', { address });

        try {
            const node = shareCardRef.current;
            if (!node) {
                throw new Error('Share card component not ready');
            }

            // Temporarily move element into view for capture
            const originalStyle = node.style.cssText;
            node.style.position = 'absolute';
            node.style.left = '0';
            node.style.top = '0';
            node.style.zIndex = '9999';

            // Wait for render
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(node, {
                backgroundColor: '#0b0b10',
                scale: 3,
                useCORS: true,
                logging: false,
                width: 1080,
                height: 1080,
                onclone: (clonedDoc: Document) => {
                    const clonedNode = clonedDoc.getElementById('wallet-share-card');
                    if (clonedNode) {
                        clonedNode.style.position = 'static';
                        clonedNode.style.left = '0';
                        clonedNode.style.top = '0';
                    }
                }
            });

            // Restore original position
            node.style.cssText = originalStyle;

            // Convert to PNG and download
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            const personality = personalityData.personalityTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            link.download = `wallet-story-${personality}.png`;
            link.href = dataUrl;
            link.click();
            link.remove();

            toast({
                title: "Share Card Ready!",
                description: "Your social card has been downloaded.",
            });
        } catch (error) {
            console.error('[Share Card Export Error]', error);
            toast({
                title: "Export Failed",
                description: error instanceof Error ? error.message : "Failed to generate share card. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsExportingShareCard(false);
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

    const shareCardCopy = `I just discovered my wallet personality: The ${personalityData.personalityTitle} 🎭✨ Analyze yours at ${window.location.origin}`;
    
    const shareOnTwitter = () => {
        track('click_share_twitter', { address });
        const text = encodeURIComponent(`I just discovered my wallet personality: The ${personalityData.personalityTitle} 🎭✨\n\nAnalyze yours at`);
        const url = encodeURIComponent(`${window.location.origin}?address=${address}`);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        window.open(twitterUrl, "_blank");
    }

    const shareOnLinkedIn = () => {
        track('click_share_linkedin', { address });
        const url = encodeURIComponent(`${window.location.origin}?address=${address}`);
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        window.open(linkedInUrl, "_blank");
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
    <>
    {/* Hidden component for full export */}
    <WalletStoryExport ref={exportRef} result={result} address={address} />
    {/* Hidden component for square share card */}
    <WalletStoryShareCard ref={shareCardRef} result={result} address={address} />


    <div className="container mx-auto max-w-3xl px-4 py-12 sm:py-16 animate-in fade-in duration-500">
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
                            <DropdownMenuItem onClick={shareOnLinkedIn}>
                                <Linkedin className="mr-2 h-4 w-4" />
                                <span>Share on LinkedIn</span>
                            </DropdownMenuItem>
                             <Separator className="my-1" />
                            <DropdownMenuItem onClick={exportShareCard} disabled={isExportingShareCard}>
                                {isExportingShareCard ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating Card...
                                    </div>
                                ) : (
                                    <>
                                        <Square className="mr-2 h-4 w-4" />
                                        <span>Share Card (Square)</span>
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={exportAsPNG} disabled={isExportingPng}>
                                {isExportingPng ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating Image...
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        <span>Full Report Image</span>
                                    </>
                                )}
                            </DropdownMenuItem>
                            {/* PDF download removed */}

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
      </TooltipProvider>
    </div>
    </>
  );
}
