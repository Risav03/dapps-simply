import Burner from "@/components/UI/burner";
import Image from "next/image";
import bg from "@/assets/background.jpg"

export default function Home() {
  return (
    <main className="text-white bg-black">
      <Image src={bg} width={1920} height={1080} className="w-screen h-screen absolute top-0 left-0 z-[-2]" />
      <Burner/>
    </main>
  );
}
