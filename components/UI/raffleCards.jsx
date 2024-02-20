import Image from "next/image"

export default function RaffleCards({name, img, price, userTickets, userLimit, participants, soldTickets, totalTickets, type }){
    return(
        <div className="text-center relative text-black my-5 w-[20rem]">
            <div className="bg-yellow-400 p-1 z-[-2]">
                <Image src={img} width={1920} height={1080} className=""/>

                <div className="relative w-[60%] mx-auto text-white">
                    <div className="bg-blue-400 py-[1px] mt-2 border-x-4  border-blue-600">
                        <h1 className="text-2xl font-bold my-4">{name}</h1>
                    </div>
                </div>

                <div className="grid grid-flow-col grid-cols-2 text-lg my-3 gap-1">
                    <div className="bg-white border-x-4 border-l-orange-500 border-r-blue-500 p-1">Participants: {participants}</div>
                    <div className="bg-white border-x-4 border-r-orange-500 border-l-blue-500 p-1">Sold: {soldTickets}/{totalTickets}</div>
                </div>
                <div className="bg-">
                    <h1>Your Holding: {userTickets}/{userLimit}</h1>
                </div>
                <div>
                    <h1>Cost: {price} ${type}</h1>
                </div>

                <button className="bg-green-400 text-4xl px-5 py-2 my-4 hover:bg-green-500 duration-100 border-x-4 border-x-green-600">Buy</button>
            </div>

            <div className="w-full absolute top-2 z-[-1] left-2 h-full bg-blue-500"></div>
        </div>
    )
}