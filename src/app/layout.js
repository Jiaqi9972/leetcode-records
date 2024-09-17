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
            <div className="flex flex-col md:flex-row">
              <Navigation className="md:w-1/5" />
              <main className="flex-1">{children}</main>
            </div>
          </DateProvider>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
