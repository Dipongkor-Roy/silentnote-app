import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/custom/Footer/Footer";
import { Suspense } from "react";
import Provider from "@/components/provider/provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "SilentNote - Connect Anonymously, Share Freely",
  description:
    "Create your profile, share your unique link, and receive anonymous messages without the need for anyone to log in.",
  metadataBase: new URL("http://localhost:3000/"),
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
          {/* Background gradient */}
         
          <div className="fixed inset-0 z-[-1] bg-custom-radial" />

          {/* Main content */}
          <Suspense fallback="...">
            <Nav />
          </Suspense>

          <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center py-32 overflow-hidden">
            {children}
          </main>

          <Toaster />
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
