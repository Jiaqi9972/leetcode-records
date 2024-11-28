import { Fira_Code } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { DateProvider } from "@/context/DateContext";
import Navigation from "@/components/Navigation";
import { UserProvider } from "@/context/UserContext";

const firaCode = Fira_Code({ subsets: ["latin"] });

export const metadata = {
  title: "Leetcode Records",
  description: "Personal tool to record the leetcode problems",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={firaCode.className}>
        <UserProvider>
          <DateProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">
                <div className="mx-auto w-[90%] md:w-[70%]">{children}</div>
              </main>
            </div>
          </DateProvider>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
