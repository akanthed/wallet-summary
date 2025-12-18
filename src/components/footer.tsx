"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";
import { Icons } from "./icons";
import { track } from "@/lib/analytics";

export function Footer() {

  const handleStarClick = () => {
    track('click_github_star');
  }

  return (
    <footer className="w-full border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-5">
        <div className="flex w-full flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-2">
            <Icons.logo className="h-7 w-7 text-primary" />
            <p className="text-sm leading-loose text-muted-foreground">
              Built with{" "}
              <a
                href="https://ai.google.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Google Gemini AI
              </a>{" "}
              &amp;{" "}
              <a
                href="https://etherscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Etherscan
              </a>
              .
            </p>
          </div>
          <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                  <Link href="https://github.com/akanthed/wallet-summary" target="_blank" rel="noopener noreferrer" onClick={handleStarClick}>
                      <Github className="h-4 w-4 mr-2" />
                      ⭐ Star on GitHub
                  </Link>
              </Button>
          </div>
        </div>
        <div className="mt-4 border-t w-full pt-4 text-center text-xs text-muted-foreground space-y-2">
          <p>
            Disclaimer: This tool is for entertainment and educational purposes only. Not financial advice.
          </p>
          <p>
            Privacy: We do not store wallet addresses or personal data. All analysis is done in real-time using public blockchain data.
          </p>
        </div>
      </div>
    </footer>
  );
}
