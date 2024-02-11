import tokenabi from "@/utils/abis/tokenabi";
import { WalletConnectButton } from "../Buttons/walletConnectButton";
import {contractAdds} from "@/utils/contractAdds";
import {ethers} from "ethers"
import {useState, useEffect} from "react";
import Swal from 'sweetalert2';
import {useAccount} from "wagmi";

import token from "@/assets/coin.png"

import Image from "next/image"

import tokenBox from "@/assets/tokenBox.png"

export default function Navbar(){

    const [balance, setBalance] = useState(0);
    const {address} = useAccount();

    async function setTokenContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        try {
          const contract = new ethers.Contract(contractAdds.simple, tokenabi, signer);
          console.log(contract);
          return contract;
        }
        catch (err) {
    
    
          console.log("Error", err)
          Swal.fire({
            title: 'Error!',
            text: 'Couldn\'t get fetching contract',
            icon: "error",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Taco OOPS!",
            confirmButtonText: 'Bruh 😭',
            confirmButtonColor: "#facc14",
            customClass: {
              container: "border-8 border-black",
              popup: "bg-white rounded-2xl border-8 border-black",
              image: "-mb-5",
              confirmButton: "w-40 text-black"
            }
          })
        }
      }

    async function fetchTokenBalance(){
        try{
            const contract = await setTokenContract();
            setBalance(ethers.utils.formatEther(String(await contract.balanceOf(address))));
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchTokenBalance();
    },[])

    return(
        <div className="flex flex-row sm:items-end sm:justify-end sm:mt-2 mt-5 mb-5 items-center justify-center relative">
            <div className="flex items-center w-[14rem] text-center justify-center -translate-y-3 -translate-x-2">
                <Image width={1920} height={1080} src={tokenBox} className="absolute w-[14rem] hue-rotate-[45deg]"/>
                <h2 className="translate-y-2 text-center text-xl flex items-center font-bold text-white">{balance} <span ><Image src={token} width={1920} height={1080} className="w-[3.2rem] translate-x-4 -rotate-12" /></span></h2>
            </div>
            <WalletConnectButton/>
        </div>
    )
}