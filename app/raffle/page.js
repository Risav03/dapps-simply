import Image from "next/image";
import bg from "@/assets/background.jpg"
import Raffle from "@/components/UI/raffle";

export default function Home() {
  return (
    <main className="text-white  bg-gradient-to-b from-black/10 to-black">
      <Image src={bg} width={1920} height={1080} className="w-screen h-screen fixed  top-0 left-0 z-[-2]" />
      <Raffle/>
    </main>
  );
}
