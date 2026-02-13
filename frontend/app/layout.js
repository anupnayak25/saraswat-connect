import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Saraswath Connect - Temple Rooms, Vehicles, Poojas & Spiritual Tours",
  description:
    "Book temple rooms, vehicles, poojas and spiritual tour packages with Saraswath Connect. Your trusted platform for seamless temple bookings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
