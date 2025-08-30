import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, Poppins  } from 'next/font/google'
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "@/providers/session-provider";
import ThemeWrapper from "@/components/layout/theme-wrapper";

export const metadata: Metadata = {
  title: "Prabisha Digital Marketing Automation",
  description: "Automate your digital marketing with Prabisha's powerful content planning, scheduling, and publishing tools.",
};

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // choose the weights you need
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // choose the weights you need
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link
          rel="icon"
          href="https://prabisha.com/wp-content/uploads/2023/10/Favicon-2.png"
          type="image/png"
        />
      </head>
      <body className={`antialiased`} suppressHydrationWarning={true}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <Toaster richColors position="top-right" closeButton />
            <ThemeWrapper>{children}</ThemeWrapper>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
