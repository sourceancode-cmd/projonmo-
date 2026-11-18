import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/LanguageContext";
import { SITE } from "@/lib/site";

const font = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Projonmo Jubo Unnoyn Songstha",
  description: "NGO Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className={`${font.className} text-lg md:text-xl leading-relaxed antialiased`}>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
