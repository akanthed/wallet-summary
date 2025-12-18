import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";
import { Icons } from "./icons";

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 sm:flex-row sm:gap-2 sm:px-0">
          <Icons.logo className="h-7 w-7 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with{" "}
            <a
              href="https://firebase.google.com/docs/genai"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Google AI
            </a>{" "}
            &{" "}
            <a
              href="https://etherscan.io"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Etherscan
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href="https://github.com/FirebaseExtended/ai-apps" target="_blank">
                    <Github className="h-4 w-4 mr-2" />
                    Star on GitHub
                </Link>
            </Button>
        </div>
      </div>
    </footer>
  );
}
