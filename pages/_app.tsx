import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/ui/navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="pt-16">
        <Component {...pageProps} />
      </main>
      <Toaster />
    </div>
  );
}
