import "../styles/globals.css";
import { Inter } from "next/font/google";
import ClientProviders from "@/components/Provider/ClientProviders";
import {UserProvider} from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Realtime Chat",
  description: "Login/Register",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UserProvider>
        <ClientProviders>{children}</ClientProviders>
        </UserProvider>
      </body>
    </html>
  );
}
