
"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult } from "@/lib/types";
import { Users, Loader2, XCircle, CheckCircle2 } from "lucide-react";
import { getRateLimit } from "@/lib/rate-limit";
import { track } from "@/lib/analytics";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/stats-card";
import { CalendarDays, Repeat, Wallet, Activity } from "lucide-react";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { Badges } from "@/components/badges";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const ENS_REGEX = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

function isValidAddress(address: string): boolean {
    return WALLET_ADDRESS_REGEX.test(address) || ENS_REGEX.test(address);
}


function WalletResultCard({ 
    walletResult, 
    address, 
    title, 
    isLoading 
}: { 
    walletResult: AnalysisResult | null, 
    address: string, 
    title: string, 
    isLoading: boolean 
}) {
    if (isLoading) {
        return (
            <Card className="flex-1 w-full animate-pulse">
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="text-center space-y-2">
                        <Skeleton className="h-10 w-3/4 mx-auto" />
                        <Skeleton className="h-5 w-full mx-auto" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-left">
                        {[...Array(4)].map((_, i) => (
                             <Card key={i}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                     <Skeleton className="h-7 w-3/4" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!walletResult) {
        return (
            <Card className="flex-1 w-full flex items-center justify-center min-h-[300px] border-destructive/50">
                <CardContent className="p-6 text-center">
                    <XCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                    <CardTitle className="text-lg mb-2">Analysis Failed</CardTitle>
                    <p className="text-muted-foreground">No data found for this wallet. Please check the address.</p>
                    <p className="text-xs text-muted-foreground mt-2 truncate">{address}</p>
                </CardContent>
            </Card>
        )
    }

    const { personalityData, stats, badges } = walletResult;

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
                   <StatsCard title="Balance" value={`${parseFloat(stats.balance).toFixed(4)} ETH`} icon={Wallet} />
                   <StatsCard title="Activity" value={stats.activityStatus} icon={Activity} />
                </div>

                {badges && badges.length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="text-lg font-headline font-semibold text-center">Achievements ({badges.length})</h3>
                            <TooltipProvider>
                                <Badges badges={badges} />
                            </TooltipProvider>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default function ComparePage() {
    const [addresses, setAddresses] = useState({ wallet1: "", wallet2: "" });
    const [wallet1Result, setWallet1Result] = useState<AnalysisResult | null>(null);
    const [wallet2Result, setWallet2Result] = useState<AnalysisResult | null>(null);
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [rateLimit, setRateLimit] = useState({ allowed: true, remaining: 5, resetTime: '' });
    const [hasCompared, setHasCompared] = useState(false);

    const { toast } = useToast();

    const canCompare = useMemo(() => {
        return isValidAddress(addresses.wallet1) && isValidAddress(addresses.wallet2) && !isPending && !(isLoading1 || isLoading2);
    }, [addresses, isPending, isLoading1, isLoading2]);


    useEffect(() => {
        const initialRateLimit = getRateLimit();
        setRateLimit(initialRateLimit);

        const urlParams = new URLSearchParams(window.location.search);
        const address1FromUrl = urlParams.get('address1');
        const address2FromUrl = urlParams.get('address2');

        const newAddresses = { wallet1: "", wallet2: "" };

        if (address1FromUrl && isValidAddress(address1FromUrl)) {
            newAddresses.wallet1 = address1FromUrl;
        }
        if (address2FromUrl && isValidAddress(address2FromUrl)) {
            newAddresses.wallet2 = address2FromUrl;
        }
        setAddresses(newAddresses);

        if (newAddresses.wallet1 && newAddresses.wallet2) {
            startTransition(() => {
                handleCompare(newAddresses.wallet1, newAddresses.wallet2);
            });
        }
    }, []);

    const handleAddressChange = (wallet: 'wallet1' | 'wallet2', value: string) => {
        setAddresses(prev => ({ ...prev, [wallet]: value }));
    }

    const analyzeWallet = async (address: string): Promise<AnalysisResult | null> => {
        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Analysis failed.");
            }
            return response.json();
        } catch (error) {
            console.error(`Error analyzing wallet ${address}:`, error);
            return null; // Return null on failure for this specific wallet
        }
    };

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
        
        setIsLoading1(true);
        setIsLoading2(true);
        setWallet1Result(null);
        setWallet2Result(null);
        setHasCompared(true);

        const [result1, result2] = await Promise.allSettled([
            analyzeWallet(address1),
            analyzeWallet(address2)
        ]);

        if (result1.status === 'fulfilled') {
            setWallet1Result(result1.value);
            if (result1.value) track('comparison_success', { address: address1 });
            else track('comparison_failed', { address: address1, error: 'No data returned' });
        } else {
            setWallet1Result(null);
            track('comparison_failed', { address: address1, error: result1.reason.message });
        }
        setIsLoading1(false);

        if (result2.status === 'fulfilled') {
            setWallet2Result(result2.value);
            if (result2.value) track('comparison_success', { address: address2 });
            else track('comparison_failed', { address: address2, error: 'No data returned' });
        } else {
            setWallet2Result(null);
            track('comparison_failed', { address: address2, error: result2.reason.message });
        }
        setIsLoading2(false);

        if (result1.status === 'rejected' && result2.status === 'rejected') {
            toast({
                title: "Comparison Failed",
                description: "Could not retrieve data for either wallet.",
                variant: "destructive",
            });
        }
    };
    
    if (hasCompared) {
        return (
            <div className="flex min-h-dvh flex-col">
              <main className="flex-1">
                <div className="container mx-auto max-w-7xl px-4 py-12 sm:py-16">
                    <h2 className="text-3xl sm:text-4xl font-headline font-bold text-center mb-12">Wallet Comparison</h2>
                    <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
                        <WalletResultCard walletResult={wallet1Result} address={addresses.wallet1} title="Wallet 1" isLoading={isLoading1} />
                        <div className="flex items-center justify-center p-4">
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <WalletResultCard walletResult={wallet2Result} address={addresses.wallet2} title="Wallet 2" isLoading={isLoading2} />
                    </div>
                </div>
                <div className="text-center pb-16">
                    <Button onClick={() => {
                        setHasCompared(false);
                        setAddresses({ wallet1: "", wallet2: "" });
                        window.history.pushState({}, '', '/compare');
                    }} size="lg">Start New Comparison</Button>
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
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Wallet 1: 0x... or name.eth"
                                    className={`h-12 w-full text-center sm:text-left pr-10 ${!addresses.wallet1 || isValidAddress(addresses.wallet1) ? '' : 'border-destructive'}`}
                                    value={addresses.wallet1}
                                    onChange={(e) => handleAddressChange('wallet1', e.target.value)}
                                    disabled={!rateLimit.allowed || isPending || isLoading1 || isLoading2}
                                />
                                {addresses.wallet1 && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {isValidAddress(addresses.wallet1) ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-destructive" />
                                    )}
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Wallet 2: 0x... or name.eth"
                                    className={`h-12 w-full text-center sm:text-left pr-10 ${!addresses.wallet2 || isValidAddress(addresses.wallet2) ? '' : 'border-destructive'}`}
                                    value={addresses.wallet2}
                                    onChange={(e) => handleAddressChange('wallet2', e.target.value)}
                                    disabled={!rateLimit.allowed || isPending || isLoading1 || isLoading2}
                                />
                                {addresses.wallet2 && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {isValidAddress(addresses.wallet2) ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-destructive" />
                                    )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button 
                            size="lg"
                            className="w-full max-w-xs"
                            onClick={() => handleCompare()}
                            disabled={!canCompare}
                        >
                            {(isLoading1 || isLoading2) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                            {(isLoading1 || isLoading2) ? 'Comparing...' : 'Compare Wallets'}
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

    