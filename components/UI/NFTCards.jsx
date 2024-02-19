"use client"

import {useState, useEffect} from "react";
import Image from "next/image";
import {ethers} from "ethers";
import { contractAdds } from "@/utils/contractAdds";
import simplyNFTabi from "@/utils/abis/simplyNFTabi";
import callerabi from "@/utils/abis/callerabi";
import { InfinitySpin } from "react-loader-spinner";
import Swal from 'sweetalert2';
import token from "@/assets/coin.png"

export default function NFTCards({name, img, tokenId, reward}){

    const[loading, setLoading] = useState(false);




    async function approval(tokenId){
        try{
            setLoading(true);
            const contract = await simplyNFTSetup();

            const approved = await contract.getApproved(tokenId);

            console.log(approved, tokenId);
            if(approved.toLowerCase() == contractAdds.burner.toLowerCase()){
                console.log("approved");
                burnToken(tokenId);
            }
            else{
                const txn = await contract.approve(contractAdds.burner, tokenId);
                txn.wait().then((res)=>{
                    burnToken(tokenId)
                })
            }
        }
        catch(err){
            setLoading(false);
            console.log(err);
        }
    }

    async function simplyNFTSetup(){
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        try {
        const contract = new ethers.Contract(contractAdds.simplyNFT, simplyNFTabi, signer);
        return contract;
        }
        catch (err) {
        console.log(err);
        }
    }

    async function burnToken(tokenId){
        try{

            const contract = await callerSetup();

            console.log("rewards", ethers.utils.parseEther(String(reward-100)));

            const txn = await contract.burn(tokenId, ethers.utils.parseEther(String(reward-100)));

            txn.wait().then((res)=>{
                setLoading(false);
                console.log(res);

                Swal.fire({
                    icon: "success",
                    title: "Item Burnt!",
                    showConfirmButton: false,
                    timer: 1500
                  }).then((res)=>{window.location.reload();})

                
            })
        }
        catch(err){
            setLoading(false);
        }
    }

    async function callerSetup(){
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        try {
        const contract = new ethers.Contract(contractAdds.caller, callerabi, signer);
        return contract;
        }
        catch (err) {
        console.log(err);
        }
    }

    // useEffect(()=>{
    //     checkTraits();
    // },[])

    return(
        <div className="text-center bg-gradient-to-tr relative from-zinc-950 to-zinc-800 rounded-2xl border-2 border-white/60 p-5">
            
            <h1 className="mb-4 font-bold text-xl">{name}</h1>

            <div className="w-52 h-52 border-white border-2 rounded-2xl">
                <Image alt={name} src={img} width={1920} height={1080} className="rounded-2xl" />
            </div>
            <h2 className="font-bold flex items-center justify-center mt-2">Reward: <span className="text-green-400 text-xl font-bold">&nbsp;&nbsp;{reward}</span> <span ><Image src={token} width={1920} height={1080} className="w-[2rem] translate-x-1 -rotate-12" /></span> </h2>
            <button disabled={loading} onClick={()=>{approval(tokenId)}} className={`mt-5 text-lg ${loading && "animate-pulse"} bg-gradient-to-br rounded-2xl border-2 hover:bg-gradient-to-b duration-300 border-white from-red-500 to-orange-400 font-bold px-5 py-3`}>{loading ? "Burning" : "Burn"}</button>
            {loading && <div className="w-full h-full bg-black/60 absolute top-0 left-0 rounded-2xl"></div>}
            {loading && <div className="flex flex-col items-center justify-center absolute top-36 left-8"><InfinitySpin visible={true} width="200" color="#fc6100" ariaLabel="infinity-spin-loading" />
            <h2 className="text-orange-500">Burning...</h2>
            </div>}
        </div>
    )
}