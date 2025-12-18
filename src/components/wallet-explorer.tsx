"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "./loading-state";
import { AnalysisResult } from "@/lib/types";
import { WalletStory } from "./wallet-story";
import { ArrowRight, Sparkles } from "lucide-react";

const EXAMPLE_WALLET = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export function WalletExplorer() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!WALLET_ADDRESS_REGEX.test(address)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address (e.g., 0x...)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive",
      });
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleWallet = () => {
    setAddress(EXAMPLE_WALLET);
    startTransition(() => {
      handleAnalyze();
    });
  };

  const handleReset = () => {
    setResult(null);
    setAddress("");
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (result) {
    return <WalletStory result={result} onReset={handleReset} />;
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
                    <div className="relative w-full max-w-md">
                        <Input
                            type="text"
                            placeholder="Paste an Ethereum address or ENS name..."
                            className="h-12 w-full pr-28 text-center sm:text-left"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        />
                        <Button 
                            className="absolute right-1.5 top-1.5 h-9"
                            onClick={handleAnalyze}
                            disabled={isPending || isLoading}
                        >
                            Explore <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                        or try{" "}
                        <button onClick={() => { setAddress(EXAMPLE_WALLET); }} className="font-medium text-primary underline-offset-4 hover:underline">
                            Vitalik&apos;s wallet
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
