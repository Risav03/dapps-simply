"use client"

import {useEffect, useState} from "react";
import Navbar from "./Navbar";
import RaffleCards from "./raffleCards";
import PastWinners from "./pastwinners";

import {useAccount} from "wagmi";

export default function Raffle(){

    const[type, setType] = useState("Simple");

    const{address} = useAccount();

    return (
        <div className="p-10">
            <Navbar/>
            <h1 className="text-6xl font-bold">SIMPLY <span className="bg-gradient-to-b from-blue-400 to-blue-600 text-transparent bg-clip-text">Raffle dApp</span></h1>

            <div className="mx-auto w-[20rem]  grid grid-flow-col grid-cols-2 px-1 py-3">
                <button onClick={()=>{setType("Simple")}} className={`${ type == "Simple" ? "bg-white shadow-lg shadow-white/50 text-black": "bg-black text-white"} px-2 py-3  rounded-l-xl font-bold`}>$SIMPLE</button>
                <button onClick={()=>{setType("Matic")}} className={`${ type == "Matic" ? "bg-purple-500 shadow-lg shadow-purple-400/50 text-white": "bg-black text-purple-500"}  rounded-r-xl px-2 py-3  font-bold`}>$MATIC</button>
            </div>

            { address == "0x0708a59Ea3d6e8Dd1492fc2bBDC54A82905D9f59" && <a href="https://simply-admin.vercel.app/"><button className="bg-red-500 p-4 text-xl font-bold">Admin Dashboard</button></a>}

            <div className=" mt-5 ">
                <h1 className="text-3xl font-bold mb-5">${type} Raffle</h1>


                { type == "Simple" && <div className="flex flex-row flex-wrap justify-center gap-5 ">
                    <RaffleCards number={1}/>
                    <RaffleCards number={2}/>
                    <RaffleCards number={3}/>
                    <RaffleCards number={4}/>
                </div>}

                { type == "Matic" && <div className="flex flex-row flex-wrap justify-center gap-5 ">
                    <RaffleCards number={5}/>
                    <RaffleCards number={6}/>
                    <RaffleCards number={7}/>
                    <RaffleCards number={8}/>
                </div>}

                <h1 className="font-bold text-3xl mt-10">Past Raffles</h1>

                { type == "Simple" && <div className="flex flex-row flex-wrap justify-center gap-5 ">
                    <PastWinners number={1}/>
                    <PastWinners number={2}/>
                    <PastWinners number={3}/>
                    <PastWinners number={4}/>
                </div>}

                { type == "Matic" && <div className="flex flex-row flex-wrap justify-center gap-5 ">
                    <PastWinners number={5}/>
                    <PastWinners number={6}/>
                    <PastWinners number={7}/>
                    <PastWinners number={8}/>
                </div>}

                <div>

                </div>
            </div>
        </div>
    )
}