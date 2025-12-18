"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";

const progressSteps = [
  "Fetching wallet data...",
  "Analyzing on-chain patterns...",
  "Generating your wallet story...",
  "Putting the final touches...",
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % progressSteps.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container py-12 px-4 md:px-6">
      <div className="mx-auto max-w-3xl animate-pulse">
        <div className="space-y-8">
          <Skeleton className="mx-auto h-12 w-48 rounded-full" />

          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center pt-4">
            <p className="text-sm text-muted-foreground transition-all duration-300">
              {progressSteps[currentStep]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
