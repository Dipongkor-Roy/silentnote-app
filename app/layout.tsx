import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import Provider from "@/components/provider/provider";
import { Toaster } from "@/component/ui/toaster";

export const metadata = {
  title: "Precedent - Building blocks for your Next.js project",
  description:
    "Precedent is the all-in-one solution for your Next.js project. It includes a design system, authentication, analytics, and more.",
  metadataBase: new URL("https://precedent.dev"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
      <Provider>
        <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-rose-100 scroll-smooth" />
        <Suspense fallback="...">
          <Nav />
        </Suspense>
      
        <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
        
          {children}
        
        </main>
        <Toaster />
     
        <Footer />
        <VercelAnalytics />
        </Provider>
      </body>
    </html>
  );
}
