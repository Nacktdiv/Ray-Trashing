import { UserProvider } from "@/context/UserContext";
import { Braah_One, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";


const braahOne = Braah_One({
  variable: "--font-braah-one",
  subsets: ["latin"],
  weight: "400"
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
    <html lang="en"> 
      <body
        className={`${braahOne.variable} ${bricolage.variable}`}
      >
        <UserProvider>
          {children} 
        </UserProvider>
      </body>
    </html>
  );
}