import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";
import { Icons } from "./icons";

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-2">
          <Icons.logo className="h-7 w-7 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
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
                <Link href="https://github.com/akanthed/wallet-summary" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    ⭐ Star on GitHub
                </Link>
            </Button>
        </div>
      </div>
    </footer>
  );
}
