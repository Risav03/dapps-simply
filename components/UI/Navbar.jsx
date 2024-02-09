import tokenabi from "@/utils/abis/tokenabi";
import { WalletConnectButton } from "../Buttons/walletConnectButton";
import {contractAdds} from "@/utils/contractAdds";
import {ethers} from "ethers"
import {useState, useEffect} from "react";
import Swal from 'sweetalert2';
import {useAccount} from "wagmi";

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
        <div className="flex flex-row sm:items-end sm:justify-end mb-5 mt-2 items-center justify-center">
            <div className="my-auto mr-10 bg-blue-400 py-2 px-4 rounded-xl border-blue-600 border-2 font-bold">
                <h2>{balance} $SIMPLE</h2>
            </div>
            <WalletConnectButton/>
        </div>
    )
}