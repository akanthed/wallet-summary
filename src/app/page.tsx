import { WalletExplorer } from "@/components/wallet-explorer";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1">
        <WalletExplorer />
      </main>
      <Footer />
    </div>
  );
}
