"use client"

import {useEffect, useState} from "react";
import Navbar from "./Navbar";
import RaffleCards from "./raffleCards";

export default function Raffle(){

    const[type, setType] = useState("Simple");

    return (
        <div className="p-10">
            <Navbar/>
            <h1 className="text-5xl font-bold">Simple <span className="bg-gradient-to-b from-blue-400 to-blue-600 text-transparent bg-clip-text">Raffle dApp</span></h1>

            <div className="w-[20%] mx-auto grid grid-flow-col grid-cols-2 p-1">
                <button onClick={()=>{setType("Simple")}} className={`${ type == "Simple" ? "bg-white shadow-lg shadow-white/50 text-black": "bg-black text-white"} p-2  rounded-l-xl font-bold`}>$SIMPLE</button>
                <button onClick={()=>{setType("Matic")}} className={`${ type == "Matic" ? "bg-purple-500 shadow-lg shadow-purple-400/50 text-white": "bg-black text-purple-500"}  rounded-r-xl p-2 font-bold`}>$MATIC</button>
            </div>


            <div className=" mt-5 ">
                <h1 className="text-3xl font-bold">${type} Raffle</h1>


                <div className="flex flex-row flex-wrap gap-5 ">
                    <RaffleCards type={type} name={"Pearls #20"} img={"https://ipfs.io/ipfs/QmZk6aDfFHfzDtqQLimHMavaeZn3qWt6Y4TUBSZRPS2omU/1390.png"} price={10} userTickets={10} userLimit={20} participants={15} soldTickets={200} totalTickets={400}/>
                    <RaffleCards type={type} name={"Pearls #20"} img={"https://ipfs.io/ipfs/QmZk6aDfFHfzDtqQLimHMavaeZn3qWt6Y4TUBSZRPS2omU/1390.png"} price={10} userTickets={10} userLimit={20} participants={15} soldTickets={200} totalTickets={400}/>
                    <RaffleCards type={type} name={"Pearls #20"} img={"https://ipfs.io/ipfs/QmZk6aDfFHfzDtqQLimHMavaeZn3qWt6Y4TUBSZRPS2omU/1390.png"} price={10} userTickets={10} userLimit={20} participants={15} soldTickets={200} totalTickets={400}/>
                    <RaffleCards type={type} name={"Pearls #20"} img={"https://ipfs.io/ipfs/QmZk6aDfFHfzDtqQLimHMavaeZn3qWt6Y4TUBSZRPS2omU/1390.png"} price={10} userTickets={10} userLimit={20} participants={15} soldTickets={200} totalTickets={400}/>

                </div>


                <div>

                </div>
            </div>
        </div>
    )
}