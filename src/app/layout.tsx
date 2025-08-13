import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/providers/session-provider";

export const metadata: Metadata = {
  title: "Prabisha Project",
  description: "This project is a Prabisha Consultancy intiative",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://prabisha.com/wp-content/uploads/2023/10/Favicon-2.png" type="image/png" />
      </head>
      <body
        className={`antialiased`}
       suppressHydrationWarning={true}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
