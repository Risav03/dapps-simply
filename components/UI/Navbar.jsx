import tokenabi from "@/utils/abis/tokenabi";
import { WalletConnectButton } from "../Buttons/walletConnectButton";
import {contractAdds} from "@/utils/contractAdds";
import {ethers} from "ethers"
import {useState, useEffect} from "react";
import Swal from 'sweetalert2';
import {useAccount} from "wagmi";
import { usePathname } from 'next/navigation'
import token from "@/assets/coin.png"

import Image from "next/image"
import Link from "next/link"
import tokenBox from "@/assets/tokenBox.png"

export default function Navbar(){

    const [balance, setBalance] = useState(0);
    const {address, isConnected} = useAccount();
    const pathname = usePathname();
    async function setTokenContract() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        try {
          const contract = new ethers.Contract(contractAdds.simple, tokenabi, signer);
          // console.log(contract);
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
            setTimeout(fetchTokenBalance, 500);
        }
    }

    useEffect(()=>{
        fetchTokenBalance();
    },[isConnected])

    return(
        <div className="flex sm:flex-row flex-col gap-10 sm:items-center sm:justify-end sm:mt-2 mt-5 mb-5 items-center justify-center relative">
          <div className="px-10 grid grid-flow-col grid-cols-2 gap-10">
            
            <Link
            href = "/burner" className={`${pathname == "/burner" && " rounded-xl w-[7rem] font-bold text-orange-400 shadow-orange-500/50 shadow-xl bg-gray-400/50"} px-8 py-3`}
            >Burner</Link>
            
            <Link
            href = "/raffle" className={`${pathname == "/raffle" && "text-blue-400 w-[7rem] font-bold rounded-xl shadow-blue-500/50 shadow-xl bg-gray-400/50"} px-8 py-3`}
            >Raffle</Link>

          </div>

            <div className="flex items-center w-[14rem] text-center  justify-center -translate-y-3 -translate-x-2">
                <Image width={1920} height={1080} src={tokenBox} className="absolute w-[14rem] grayscale brightness-150"/>
                <h2 className="translate-y-2 text-center text-xl flex items-center font-bold text-black">{balance} <span ><Image src={token} width={1920} height={1080} className="w-[2.5rem] translate-x-4 -rotate-12" /></span></h2>
            </div>
            <WalletConnectButton/>
        </div>
    )
}