import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

const font = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"], // ওয়েট বাড়ানো হয়েছে
  display: "swap",
});

export const metadata = {
  title: SITE.name,
  description: SITE.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className={`${font.className} text-lg md:text-xl leading-relaxed antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
