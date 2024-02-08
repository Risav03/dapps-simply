"use client"

import Navbar from "./Navbar"
import { contractAdds } from "@/utils/contractAdds"
import burnerabi from "@/utils/abis/burnerabi"
import { useEffect, useState } from "react"
import callerabi from "@/utils/abis/callerabi"
import {ethers} from "ethers"
import {useAccount} from "wagmi"
import simplyNFTabi from "@/utils/abis/simplyNFTabi"
import Swal from "sweetalert2";
import { InfinitySpin } from "react-loader-spinner"

import Image from "next/image";

export default function Burner(){

    const{address, isConnected} = useAccount();

    const[displayNFT, setDisplayNFT] = useState([]);
    const[loading, setLoading] = useState(false);
    const[loadingNFTs, setLoadingNFTs] = useState(false);

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

    async function fetchNFTs(){
        try{
        
            setLoadingNFTs(true);
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
            setLoadingNFTs(false);
        }
        catch(err){
            console.log(err);
            setLoadingNFTs(false);
            fetchNFTs();
            
        }
    }

    async function burnToken(tokenId){
        try{
            console.log(tokenId, String(ethers.utils.parseEther("1")));
            const contract = await callerSetup();

            const txn = await contract.burn(tokenId, ethers.utils.parseEther("1"));

            txn.wait().then((res)=>{
                setLoading(false);
                console.log(res)
            })
        }
        catch(err){
            setLoading(false);
        }
    }

    useEffect(()=>{
        console.log(isConnected);
        if(isConnected)
        fetchNFTs();
    },[])

    return(
        <div className="sm:p-12 p-4 overflow-hidden">
            
            <Navbar/>
            <h1 className="text-6xl font-bold">SIMPLY Burner</h1>
            <p className="mt-4 text-xl">Burn your SIMPLY NFT & earn $SIMPLE based on its traits!</p>
            {/* <div className="w-[400px] h-[400px] bg-gradient-to-br from-orange-500 to-yellow-400 blur-[200px] absolute z-[-1] top-[-80px] left-[-230px]"></div>
            <div className="w-[500px] h-[400px] bg-gradient-to-br from-orange-600 to-red-400 blur-[250px] absolute z-[-1] top-[-30px] right-[-130px]"></div>
            <div className="w-[600px] h-[600px] bg-gradient-to-br from-yellow-300 to-red-400 blur-[250px] absolute z-[-1] bottom-[-100px] right-[-10px]"></div> */}


            <div className="w-[95%] h-[30rem] overflow-y-scroll sm:mt-20 mt-10 bg-white/30 p-5 rounded-2xl">
                <h1 className="text-xl mb-5 font-bold">Your NFTs:</h1>
                { loadingNFTs && 
                <div className="flex flex-col h-[80%] items-center justify-center">
                     <InfinitySpin visible={true} width="200" color="#fc6100" ariaLabel="infinity-spin-loading" />
                     <h1 className="text-orange-500 animate-pulse">Loading...</h1>
                     </div>
                        }
                <div className="flex flex-wrap gap-5 mx-auto justify-center">
                {displayNFT.map((item)=>(
                    <div className="text-center bg-black/70 rounded-2xl border-2 border-white/60 p-5">
                        <h1 className="mb-4 font-bold text-xl">{item.name}</h1>

                        <div className="w-52 h-52 border-white border-2 rounded-2xl">
                            <Image alt={item.name} src={item.img} width={1920} height={1080} className="rounded-2xl" />
                        </div>
                        <button disabled={loading} onClick={()=>{approval(item.tokenId)}} className={`mt-5 text-lg ${loading && "animate-pulse"} bg-gradient-to-br rounded-2xl border-2 hover:bg-gradient-to-b duration-300 border-white from-orange-500 to-orange-300 font-bold px-5 py-3`}>Burn</button>
                        </div>
                ))}
                </div>
                
            </div>
        </div>
    )
}