import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Rainbow from "@/utils/rainbow/rainbowKit";
import pixelfont from "next/font/local"

const font = pixelfont({ src: "../assets/Minecraft.ttf" })
const inter = Inter({ subsets: ["latin"] });
const mont = Montserrat({subsets:["latin"]});

export const metadata = {
  title: "Simple dApps",
  description: "An accumulation of dApps for the $SIMPLE ecosystem and its lovely community members",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Rainbow>
          {children}
        </Rainbow>
        </body>
    </html>
  );
}
