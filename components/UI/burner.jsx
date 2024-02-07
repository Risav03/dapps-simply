"use client"

import Navbar from "./Navbar"
import { contractAdds } from "@/utils/contractAdds"
import burnerabi from "@/utils/abis/burnerabi"
import { useEffect, useState } from "react"

import {ethers} from "ethers"
import Swal from "sweetalert2";

import Image from "next/image";

export default function Burner(){

    const[displayNFT, setDisplayNFT] = useState([]);

    async function burningSetup(){
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        try {
        const contract = new ethers.Contract(contractAdds.burner, burnerabi, signer);
        return contract;
        }
        catch (err) {
        console.log(err);
        }
    }

    async function fetchNFTs(){
        try{
            const contract = await burningSetup();
            const response = await contract.fetchTokenURI();

            const arr = []

            for(let i = 0; i< response.length; i++){
                const uri = response[i][0];
                const tokenId = Number(response[i][1]);

                const metadata = "https://ipfs.io/ipfs/" + uri.substr(7);
                const meta = await fetch(metadata);
                const json = await meta.json();
                const name = json["name"];
                const img = "https://ipfs.io/ipfs/" + json["image"].substr(7);

                arr.push({tokenId, name, img});
            }
            console.log(arr);

            setDisplayNFT(arr);
        }
        catch(err){
            console.log(err);
            fetchNFTs();
        }
    }

    useEffect(()=>{
        fetchNFTs();
    },[])

    return(
        <div>
            <Navbar/>
            <h1 className="text-6xl font-bold">SIMPLY Burner</h1>
            <p className="mt-4 text-xl">Burn your SIMPLY NFT & earn $SIMPLE based on its traits!</p>
            <div className="w-[400px] h-[400px] bg-gradient-to-br from-orange-500 to-yellow-400 blur-[200px] absolute z-[-1] top-[-80px] left-[-230px]"></div>
            <div className="w-[500px] h-[400px] bg-gradient-to-br from-orange-500 to-yellow-400 blur-[250px] absolute z-[-1] top-[-30px] right-[-130px]"></div>

            <div className="w-[95%] mt-24 bg-white/30 p-5 rounded-2xl">
                <h1 className="text-xl mb-5 font-bold">Your NFTs:</h1>
                <div className="flex flex-wrap gap-5 mx-auto justify-center">
                {displayNFT.map((item)=>(
                    <div className="text-center bg-black/70 rounded-2xl border-2 border-white/60 p-5">
                        <h1 className="mb-4 font-bold text-xl">{item.name}</h1>

                        <div className="w-52 h-52 border-white border-2 rounded-2xl">
                            <Image alt={item.name} src={item.img} width={1920} height={1080} className="rounded-2xl" />
                        </div>
                        <button className="mt-5 text-lg bg-gradient-to-br rounded-2xl border-2 border-white from-orange-500 to-orange-300 font-bold px-5 py-3">Burn</button>
                        </div>
                ))}
                </div>
                
            </div>
        </div>
    )
}