import { UserProvider } from "@/context/UserContext";
import { Geist, Geist_Mono, Braah_One, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";


const braahOne = Braah_One({
  weight: "400", // Braah One hanya punya satu weight
  variable: "--font-braah-one",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nama Aplikasi Kamu",
  description: "Deskripsi aplikasi kamu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning> 
      <body
        className={`
          ${braahOne.variable} 
          ${bricolage.variable} 
          antialiased bg-white text-slate-900
        `}
        suppressHydrationWarning={true}
      >
        <UserProvider>
          {children} 
        </UserProvider>
      </body>
    </html>
  );
}