"use client"

import Navbar from "./Navbar"
import { contractAdds } from "@/utils/contractAdds"
import burnerabi from "@/utils/abis/burnerabi"
import { useEffect, useState } from "react"

import {ethers} from "ethers"
import {useAccount} from "wagmi"

import Swal from "sweetalert2";
import { InfinitySpin } from "react-loader-spinner"

import Image from "next/image";
import NFTCards from "./NFTCards"

export default function Burner(){

    const{address, isConnected} = useAccount();

    const[displayNFT, setDisplayNFT] = useState([]);
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

                arr.push({tokenId, name, img, uri});
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

    useEffect(()=>{
        console.log(isConnected);
        if(isConnected)
        fetchNFTs();
    },[])

    return(
        <div className="sm:p-12 p-4 overflow-hidden">
            
            <Navbar/>
            <h1 className="text-6xl mt-5 font-bold">SIMPLY <span className="bg-gradient-to-b from-orange-600 to-orange-400 text-transparent bg-clip-text">Burner</span></h1>
            <p className="mt-4 text-xl">Burn your SIMPLY NFT & earn $SIMPLE based on its traits!</p>
            {/* <div className="w-[400px] h-[400px] bg-gradient-to-br from-orange-500 to-yellow-400 blur-[200px] absolute z-[-1] top-[-80px] left-[-230px]"></div>
            <div className="w-[500px] h-[400px] bg-gradient-to-br from-orange-600 to-red-400 blur-[250px] absolute z-[-1] top-[-30px] right-[-130px]"></div>
            <div className="w-[600px] h-[600px] bg-gradient-to-br from-yellow-300 to-red-400 blur-[250px] absolute z-[-1] bottom-[-100px] right-[-10px]"></div> */}


            <div className="w-[95%] sm:h-[34rem] min-[1600px]:h-[36rem] h-[30rem] mx-auto overflow-y-scroll sm:mt-12 mt-10 no-scrollbar bg-white/30 p-5 rounded-2xl">
                <h1 className="text-xl mb-5 font-bold ml-3">Your NFTs:</h1>
                { loadingNFTs && 
                <div className="flex flex-col h-[80%] items-center justify-center">
                     <InfinitySpin visible={true} width="200" color="#fc6100" ariaLabel="infinity-spin-loading" />
                     <h1 className="text-orange-500 animate-pulse font-bold">Fetching NFTs...</h1>
                     </div>
                        }
                <div className="flex flex-wrap gap-5 mx-auto justify-center">
                {displayNFT.map((item)=>(
                    <NFTCards name={item.name} tokenId={item.tokenId} img={item.img} uri={item.uri}/>
                ))}
                </div>
                
            </div>
        </div>
    )
}