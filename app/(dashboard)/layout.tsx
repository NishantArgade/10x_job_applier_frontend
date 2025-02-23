import { ReactNode } from "react";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
