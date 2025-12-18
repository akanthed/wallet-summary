"use client";

import { useEffect, useState } from "react";
import { Icons } from "./icons";

const progressSteps = [
  "Connecting to the blockchain...",
  "Fetching wallet data...",
  "Analyzing on-chain patterns...",
  "Generating your wallet story...",
  "Putting the final touches...",
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep >= progressSteps.length -1) {
            clearInterval(interval);
            return prevStep;
        }
        return prevStep + 1;
      });
    }, 2000); // Increased interval for a better feel

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container py-12 px-4 md:px-6 flex items-center justify-center min-h-[60vh]">
      <div className="mx-auto max-w-md text-center">
        <div className="space-y-4">
            <Icons.logo className="h-16 w-16 text-primary animate-pulse mx-auto" />
            <h2 className="text-2xl font-headline font-semibold">Crafting Your Story</h2>
            <p className="text-muted-foreground">
                Please wait while we analyze the wallet&apos;s journey on the blockchain. This usually takes 10-15 seconds.
            </p>
        </div>
        <div className="relative pt-10">
            <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(currentStep + 1) * (100 / progressSteps.length)}%` }}></div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 transition-all duration-300">
              {progressSteps[currentStep]}
            </p>
        </div>
      </div>
    </div>
  );
}
