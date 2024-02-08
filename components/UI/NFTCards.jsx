import {useState, useEffect} from "react";
import Image from "next/image";
import {ethers} from "ethers";
import { contractAdds } from "@/utils/contractAdds";
import simplyNFTabi from "@/utils/abis/simplyNFTabi";
import callerabi from "@/utils/abis/callerabi";

export default function NFTCards({name, img, tokenId, uri}){

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

    return(
        <div className="text-center bg-black/70 rounded-2xl border-2 border-white/60 p-5">
            <h1 className="mb-4 font-bold text-xl">{name}</h1>

            <div className="w-52 h-52 border-white border-2 rounded-2xl">
                <Image alt={name} src={img} width={1920} height={1080} className="rounded-2xl" />
            </div>
            <button disabled={loading} onClick={()=>{approval(tokenId)}} className={`mt-5 text-lg ${loading && "animate-pulse"} bg-gradient-to-br rounded-2xl border-2 hover:bg-gradient-to-b duration-300 border-white from-red-500 to-orange-400 font-bold px-5 py-3`}>Burn</button>
        </div>
    )
}