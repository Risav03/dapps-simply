import Burner from "@/components/UI/burner";
import Image from "next/image";
import bg from "@/assets/background.jpg"

export default function Home() {
  return (
    <main className="text-white bg-gradient-to-b from-black/10 to-black flex h-[100vh] items-center justify-center">
      <Image src={bg} width={1920} height={1080} className="w-screen h-screen fixed top-0 left-0 z-[-2]" />
      <h1 className="font-bold text-5xl animate-pulse">BEING BUILT... 🛠️</h1>
    </main>
  );
}
