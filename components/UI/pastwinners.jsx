import raffleabi from "@/utils/abis/raffleabi"
import erc721abi from "@/utils/abis/erc721abi"
import { contractAdds } from "@/utils/contractAdds"
import {useState, useEffect} from "react"
import Image from "next/image"

import {ethers} from "ethers";

export default function PastWinners({number}){

    const [winnerAddress, setWinnerAddress] = useState("");
    const [nftName, setNftName] = useState("");
    const [nftImage, setNftImage] = useState("");

    async function setRaffle(){
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        try {
        const contract = new ethers.Contract(contractAdds.raffle, raffleabi, signer);
        // console.log("raffle", raffleAdd);
        return contract;
        }
        catch(err){
            console.log(err);
        }
    }

    async function setERC721(contractAdd){
        try{

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            if(contractAdd.toUpperCase() != "0X0000000000000000000000000000000000000000"){
              const contract = new ethers.Contract(contractAdd, erc721abi, signer);
              return contract
            }
    
          }
          catch(err){
            console.log(err);
          }
    }

    async function fetchPastWinners(){

        try{
            const contract = await setRaffle();

            const lastwinner = await contract?.lastWinners(number);
            console.log("LAST WINNER",lastwinner);
    
            if(lastwinner.toUpperCase() != "0X0000000000000000000000000000000000000000"){
    
                setWinnerAddress(lastwinner);
                const lastWonAddress = await contract?.lastNftWonContract(number);
                console.log("HELLO", lastWonAddress);
                const erc721contract = await setERC721(lastWonAddress);
        
                const tokenURI = await erc721contract?.tokenURI(Number(await contract?.lastNftWonTokenId(number)));
                const metadata = `https://ipfs.io/ipfs/${tokenURI.substr(7)}`;
                const meta = await fetch(metadata);
                const json = await meta.json();
                const name = json["name"];
                const image = json["image"];
                const newimage = `https://cloudflare-ipfs.com/ipfs/${image.substr(7)}`
    
                console.log(newimage);
        
                setNftName(name);
                setNftImage(newimage)
                console.log(name, newimage);
            }
    
            else{
                setWinnerAddress("None")
            }
        }
        catch(err){
            console.log(err);
        }
        
    }

    useEffect(()=>{
        fetchPastWinners()
    },[])

    return(
        <>
            <div className="bg-blue-400 w-[20rem] h-[20rem] p-3 text-center grid grid-cols-1 text-white border-2 border-black">
            <div className="bg-white mx-auto w-[13rem] h-[13rem] row-span-3 border-2 border-black overflow-hidden">
                {nftImage != "" && <Image width={1920} height={1080} className="mx-auto h-[16rem] col-span-2 bg-white w-[16rem] border-2 object-cover" src={nftImage}/>}
            </div>
                
                <div className="col-span-1">
                    <h2 className="text-2xl mt-2">{nftName}</h2>
                    <h2 className="text-sm text-black truncate overflow-ellipsis w-full px-5">{winnerAddress}</h2>
                </div>
            </div>
        </>
    )
}