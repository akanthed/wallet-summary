
"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult } from "@/lib/types";
import { ArrowRight, Sparkles, RefreshCw, Info, CheckCircle2, XCircle, Users, Loader2 } from "lucide-react";
import { getRateLimit } from "@/lib/rate-limit";
import { track } from "@/lib/analytics";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/stats-card";
import { CalendarDays, Repeat, Wallet, Activity } from "lucide-react";
import { Footer } from "@/components/footer";

const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const ENS_REGEX = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

function isValidAddress(address: string): boolean {
    return WALLET_ADDRESS_REGEX.test(address) || ENS_REGEX.test(address);
}

type ComparisonResult = {
    wallet1: AnalysisResult;
    wallet2: AnalysisResult;
}

function WalletComparisonResult({ result, address1, address2 }: { result: ComparisonResult, address1: string, address2: string }) {
    
    const renderWalletCard = (walletResult: AnalysisResult | null, address: string, title: string) => {
        if (!walletResult) {
            return (
                <Card className="flex-1 w-full flex items-center justify-center min-h-[300px]">
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No data for this wallet.</p>
                    </CardContent>
                </Card>
            )
        }

        const { personalityData, stats } = walletResult;

        return (
            <Card className="flex-1 w-full animate-in fade-in-0 duration-500">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-headline truncate" title={address}>{title}</CardTitle>
                    <p className="text-sm text-muted-foreground truncate">{address}</p>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-bold font-headline text-primary">{personalityData.personalityTitle}</h3>
                        <p className="text-sm text-muted-foreground">{personalityData.oneLineSummary}</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                        {personalityData.traits.map((trait, index) => (
                            <Badge key={index} variant="secondary" className="text-sm px-3 py-1">{trait}</Badge>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left">
                       <StatsCard title="Age" value={`${stats.walletAge} days`} icon={CalendarDays} className="text-xs"/>
                       <StatsCard title="TXs" value={stats.txCount} icon={Repeat} />
                       <StatsCard title="Balance" value={`${stats.balance} ETH`} icon={Wallet} />
                       <StatsCard title="Activity" value={stats.activityStatus} icon={Activity} />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:py-16">
            <h2 className="text-3xl sm:text-4xl font-headline font-bold text-center mb-12">Wallet Comparison</h2>
            <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
                {renderWalletCard(result.wallet1, address1, "Wallet 1")}
                <div className="flex items-center justify-center p-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                {renderWalletCard(result.wallet2, address2, "Wallet 2")}
            </div>
        </div>
    )
}


export default function ComparePage() {
    const [addresses, setAddresses] = useState({ wallet1: "", wallet2: "" });
    const [result, setResult] = useState<ComparisonResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [rateLimit, setRateLimit] = useState({ allowed: true, remaining: 5, resetTime: '' });

    const { toast } = useToast();

    const areAddressesValid = useMemo(() => {
        const { wallet1, wallet2 } = addresses;
        return (wallet1 ? isValidAddress(wallet1) : true) && (wallet2 ? isValidAddress(wallet2) : true);
    }, [addresses]);
    
    const canCompare = useMemo(() => {
        return isValidAddress(addresses.wallet1) && isValidAddress(addresses.wallet2) && !isPending;
    }, [addresses, isPending]);


    useEffect(() => {
        const initialRateLimit = getRateLimit();
        setRateLimit(initialRateLimit);

        const urlParams = new URLSearchParams(window.location.search);
        const address1FromUrl = urlParams.get('address1');
        const address2FromUrl = urlParams.get('address2');

        const newAddresses = { wallet1: "", wallet2: "" };
        let shouldAnalyze = false;
        if (address1FromUrl && isValidAddress(address1FromUrl)) {
            newAddresses.wallet1 = address1FromUrl;
            shouldAnalyze = true;
        }
        if (address2FromUrl && isValidAddress(address2FromUrl)) {
            newAddresses.wallet2 = address2FromUrl;
            shouldAnalyze = true;
        }
        setAddresses(newAddresses);

        if (shouldAnalyze && isValidAddress(newAddresses.wallet1) && isValidAddress(newAddresses.wallet2)) {
            startTransition(() => {
                handleCompare(newAddresses.wallet1, newAddresses.wallet2);
            });
        }
    }, []);

    const handleAddressChange = (wallet: 'wallet1' | 'wallet2', value: string) => {
        setAddresses(prev => ({ ...prev, [wallet]: value }));
    }

    const handleCompare = async (address1 = addresses.wallet1, address2 = addresses.wallet2) => {
        if (!isValidAddress(address1) || !isValidAddress(address2)) {
            toast({
                title: "Invalid Address",
                description: "Please enter a valid Ethereum address or ENS name for both wallets.",
                variant: "destructive",
            });
            return;
        }

        track('compare_wallets', { address1, address2 });
        window.history.pushState({}, '', `?address1=${address1}&address2=${address2}`);

        const currentRateLimitInfo = getRateLimit();
        if (!currentRateLimitInfo.allowed) {
            toast({
                title: "Daily Limit Reached",
                description: `You have reached your daily analysis limit. Please try again after ${currentRateLimitInfo.resetTime}.`,
                variant: "destructive",
            });
            setRateLimit(currentRateLimitInfo);
            return;
        }
        
        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/compare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address1, address2 }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "An unknown error occurred.");
            }

            const data: ComparisonResult = await response.json();
            setResult(data);
            track('comparison_success', { address1, address2 });

        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                title: "Comparison Failed",
                description: message,
                variant: "destructive",
            });
            setResult(null);
            track('comparison_failed', { address1, address2, error: message });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (result) {
        return (
            <div className="flex min-h-dvh flex-col">
              <main className="flex-1">
                <WalletComparisonResult result={result} address1={addresses.wallet1} address2={addresses.wallet2} />
                <div className="text-center pb-16">
                    <Button onClick={() => setResult(null)} size="lg">Start New Comparison</Button>
                </div>
              </main>
              <Footer />
            </div>
        )
    }

    return (
        <div className="flex min-h-dvh flex-col">
        <main className="flex-1">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/10 via-transparent">
            <div className="container mx-auto px-4 py-24 sm:py-32 lg:py-40">
                <div className="mx-auto max-w-3xl text-center">
                    <Users className="mx-auto h-12 w-12 text-primary" />
                    <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                        Wallet vs. Wallet
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Compare two Ethereum wallets side-by-side to see how their personalities and activities stack up.
                    </p>
                    
                    <div className="mt-10 flex flex-col items-center justify-center gap-6">
                        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                type="text"
                                placeholder="Wallet 1: 0x... or name.eth"
                                className={`h-12 w-full text-center ${!addresses.wallet1 || isValidAddress(addresses.wallet1) ? '' : 'border-destructive'}`}
                                value={addresses.wallet1}
                                onChange={(e) => handleAddressChange('wallet1', e.target.value)}
                                disabled={!rateLimit.allowed || isPending || isLoading}
                            />
                            <Input
                                type="text"
                                placeholder="Wallet 2: 0x... or name.eth"
                                className={`h-12 w-full text-center ${!addresses.wallet2 || isValidAddress(addresses.wallet2) ? '' : 'border-destructive'}`}
                                value={addresses.wallet2}
                                onChange={(e) => handleAddressChange('wallet2', e.target.value)}
                                disabled={!rateLimit.allowed || isPending || isLoading}
                            />
                        </div>
                        <Button 
                            size="lg"
                            className="w-full max-w-xs"
                            onClick={() => handleCompare()}
                            disabled={!canCompare || isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                            {isLoading ? 'Comparing...' : 'Compare Wallets'}
                        </Button>
                    </div>

                    <div className="mt-4">
                        {!rateLimit.allowed ? (
                            <p className="text-sm text-destructive">
                                Daily limit reached. Resets at {rateLimit.resetTime}.
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
                                    Or analyze a single wallet
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </main>
        <Footer />
        </div>
    );
}
