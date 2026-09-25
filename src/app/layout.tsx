import "~/app/globals.css";
import { ConvexClientProvider } from "~/components/providers/convex-provider";
import { ThemeProvider } from "~/components/providers/theme-proivder";
import { Toaster } from "~/components/ui/sonner";

export const metadata = {
  title: "Pulse — Incident monitoring",
  description: "Multi-agent AI system for automated incident detection and resolution",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#050807] text-white antialiased">
        <ConvexClientProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
            <Toaster position="top-right" richColors theme="dark" />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}