import Burner from "@/components/UI/burner";
import Link from "next/link"
import Image from "next/image";
import bg from "@/assets/background.jpg"

export default function Home() {
  return (
    <main className="text-white text-center px-8 py-36">
      <Image src={bg} width={1920} height={1080} className="w-screen h-screen fixed top-0 left-0 z-[-2]" />
      
      <h1 className="text-7xl font-bold">SIMPLY <span className="bg-gradient-to-b from-green-400 to-green-700 text-transparent bg-clip-text">dApps</span></h1>

    <div className="w-full items-center justify-center flex flex-row flex-wrap gap-10 mt-24">

      <div className="w-[25rem] relative  group">
        <div className="absolute w-full h-full bg-gradient-to-b from-orange-400 top-0 right-0 group-hover:shadow-2xl group-hover:shadow-orange-500/60 to-orange-600 duration-200 z-[-1] group-hover:top-2 group-hover:right-2"></div>
        <Link href="/burner">
            <button className="text-3xl w-full font-bold bg-black h-[12rem]">Burner</button>
        </Link>
      </div>

      <div className="w-[25rem] relative group">
      <div className="absolute w-full h-full bg-gradient-to-b from-blue-400 top-0 group-hover:shadow-2xl group-hover:shadow-blue-500/50 to-blue-600 duration-200 z-[-1] group-hover:top-2 "></div>
      <Link href="/raffle">
            <button className="text-3xl w-full font-bold bg-black h-[12rem]">Raffle</button>
        </Link>
      </div>

      <div className="w-[25rem] relative group">
        <div className="absolute w-full h-full bg-gradient-to-b from-green-400 top-0 left-0 group-hover:shadow-2xl group-hover:shadow-green-500/60 to-green-600 duration-200 z-[-1] group-hover:top-2 group-hover:left-2"></div>
        <Link href="/marketplace">
            <button className="text-3xl w-full font-bold bg-black h-[12rem]">Marketplace</button>
        </Link>      </div>

    </div>
     
    </main>
  );
}
