
"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "./loading-state";
import { AnalysisResult } from "@/lib/types";
import { WalletStory } from "./wallet-story";
import { ArrowRight, Sparkles, RefreshCw, Info, CheckCircle2, XCircle } from "lucide-react";
import { getCachedResult, setCachedResult } from "@/lib/cache";
import { checkRateLimit, incrementRateLimit, getRateLimit } from "@/lib/rate-limit";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { track } from "@/lib/analytics";


const EXAMPLE_WALLET = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const ENS_REGEX = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

function isValidAddress(address: string): boolean {
    return WALLET_ADDRESS_REGEX.test(address) || ENS_REGEX.test(address);
}

export function WalletExplorer() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [rateLimit, setRateLimit] = useState({ allowed: true, remaining: 5, resetTime: '' });
  const [isCached, setIsCached] = useState(false);

  const { toast } = useToast();

  const isAddressValid = useMemo(() => address ? isValidAddress(address) : true, [address]);

  useEffect(() => {
    // This now runs only on the client, avoiding the hydration mismatch.
    const initialRateLimit = getRateLimit();
    setRateLimit(initialRateLimit);

    // Check for address in URL on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const addressFromUrl = urlParams.get('address');
    if (addressFromUrl && isValidAddress(addressFromUrl)) {
      setAddress(addressFromUrl);
      startTransition(() => {
        handleAnalyze(addressFromUrl);
      });
    }
  }, []);

  const handleAnalyze = async (walletAddress = address, forceRefresh = false) => {
    if (!isValidAddress(walletAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address or ENS name.",
        variant: "destructive",
      });
      return;
    }
    
    track('analyze_wallet', { address: walletAddress, forceRefresh });
    // Update URL without reloading page
    window.history.pushState({}, '', `?address=${walletAddress}`);

    // Rate limit check
    const currentRateLimitInfo = getRateLimit();
    if (!currentRateLimitInfo.allowed && !forceRefresh) {
        toast({
            title: "Daily Limit Reached",
            description: `You have reached your daily analysis limit. Please try again after ${currentRateLimitInfo.resetTime}.`,
            variant: "destructive",
        });
        setRateLimit(currentRateLimitInfo);
        return;
    }

    // Cache check
    if (!forceRefresh) {
        const cachedResult = getCachedResult(walletAddress);
        if (cachedResult) {
            setResult(cachedResult);
            setIsCached(true);
            return;
        }
    }
    
    setIsCached(false);
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setCachedResult(walletAddress, data);
      incrementRateLimit();
      setRateLimit(getRateLimit());
      track('analysis_success', { address: walletAddress, personality: data.personalityData.personalityTitle });

    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive",
      });
      setResult(null);
      track('analysis_failed', { address: walletAddress, error: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleWallet = () => {
    track('click_example_wallet');
    setAddress(EXAMPLE_WALLET);
    startTransition(() => {
      handleAnalyze(EXAMPLE_WALLET);
    });
  };

  const handleReset = () => {
    setResult(null);
    setAddress("");
    setIsCached(false);
    window.history.pushState({}, '', '/');
  }

  const handleForceRefresh = () => {
    track('force_refresh', { address });
    handleAnalyze(address, true);
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (result) {
    return (
        <div>
            {isCached && (
                <Alert className="mb-4 container max-w-3xl mx-auto border-accent">
                    <Info className="h-4 w-4 text-accent" />
                    <AlertTitle className="text-accent">Displaying Cached Result</AlertTitle>
                    <AlertDescription className="flex justify-between items-center">
                        <span>This story was generated recently.</span>
                        <Button variant="outline" size="sm" onClick={handleForceRefresh}>
                            <RefreshCw className="mr-2 h-3 w-3" />
                            Force Refresh
                        </Button>
                    </AlertDescription>
                </Alert>
            )}
            <WalletStory result={result} onReset={handleReset} address={address} />
        </div>
    );
  }

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/10 via-transparent">
        <div className="container mx-auto px-4 py-24 sm:py-32 lg:py-40">
            <div className="mx-auto max-w-2xl text-center">
                <Sparkles className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                    Wallet Story Explorer
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                    Turn any Ethereum wallet into a readable story. Discover its personality, history, and on-chain journey, powered by AI.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <div className="relative w-full max-w-lg">
                        <Input
                            type="text"
                            placeholder="0x... or vitalik.eth"
                            className={`h-12 w-full pr-40 text-center sm:text-left ${
                                address && !isAddressValid ? 'border-destructive' : ''
                              }`}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            disabled={!rateLimit.allowed || isPending}
                        />
                        {address && (
                          <div className="absolute right-[140px] top-1/2 -translate-y-1/2">
                            {isAddressValid ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-destructive" />
                            )}
                          </div>
                        )}
                        <Button 
                            className="absolute right-1.5 top-1.5 h-9"
                            onClick={() => handleAnalyze()}
                            disabled={!rateLimit.allowed || isPending || !address || !isAddressValid}
                        >
                            Explore <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="mt-4">
                    {!rateLimit.allowed ? (
                        <p className="text-sm text-destructive">
                            Daily limit reached. Resets at {rateLimit.resetTime}.
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {rateLimit.remaining} analyses remaining today. Or try{" "}
                            <button onClick={handleExampleWallet} disabled={isPending} className="font-medium text-primary underline-offset-4 hover:underline disabled:text-muted-foreground disabled:no-underline">
                                Vitalik&apos;s wallet
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
