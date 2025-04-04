import dynamic from "next/dynamic";
import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/auth-provider";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/theme-provider";
const NextProgress = dynamic(() => import("@/components/next-progress"));

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Voice Agent | Smart Call Automation",
  description:
    "An advanced AI-powered voice agent for automated call handling, speech synthesis, and real-time voice interactions.",
  keywords: [
    "AI Voice Agent",
    "Call Automation",
    "Speech Synthesis",
    "Voice AI",
    "Conversational AI",
  ],
  robots: "index, follow",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextProgress />
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
