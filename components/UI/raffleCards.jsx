import { contractAdds } from "@/utils/contractAdds"
import raffleabi from "@/utils/abis/raffleabi"
import erc721abi from "@/utils/abis/erc721abi"
import erc20abi from "@/utils/abis/erc20abi"
import { useState, useEffect } from "react"
import Image from "next/image"
import {useAccount} from "wagmi"
import arrowright from "@/assets/next.png"
// import noraffle from "../../../assets/raffle_comingsoon.png"

import {ethers} from "ethers"
import { InfinitySpin, MutatingDots } from "react-loader-spinner"

export default function RaffleFetcher({number}){

    const [name, setName] = useState("");
    const [amount, setAmount] = useState(1);
    const [image, setImage] = useState("");
    const [ticketsSold, setTicketsSold] = useState(0);
    const [entrants, setEntrants] = useState(0);
    const [winner, setWinner] = useState("");
    const [itemExists, setItemExists] = useState(false);
    const [limitPerWallet, setLimitPerWallet] = useState(0);
    const [limit, setLimit] = useState(0);
    const [holding, setHolding] = useState(0);

    const [loading, setLoading]  = useState(false);
    const [loadingRaffle, setLoadingRaffle] = useState(false);

    const [price, setPrice] = useState(0);



    const[ticketModal, setTicketModal] = useState(false);
    
    const{ address } = useAccount();

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
    
            const contract1 = new ethers.Contract(contractAdds.raffle, raffleabi, signer);
            const add = await contract1?.raffleContract(number);
            console.log(add);
            if(add.toUpperCase() == "0X0000000000000000000000000000000000000000"){
              const contract = new ethers.Contract(contractAdd, erc721abi, signer);
              return contract
            }
    
            else{
              const contract = new ethers.Contract(add, erc721abi, signer)
              return contract;
    
            }
          }
          catch(err){
            console.log(err);
          }
    }

    async function setERC20(){
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        try {
        const contract = new ethers.Contract(contractAdds.simple, erc20abi, signer);

        return contract;
        }
        catch(err){
            console.log(err);
        }
    }

    async function changeAmount(val){
        if(amount>=1 && amount+val+ticketsSold<=limit && amount+val+holding<=limitPerWallet){
            setAmount(amount+val);

        }
        if(amount == 0 && val == 1){
            setAmount(1);

        }
    }
    
    async function fetchRaffle(){
        try{
            setLoadingRaffle(true);
            console.log("WALLET", address);
            const contract = await setRaffle();
            // console.log("HELLOOOO", number);
            const add = await contract?.raffleContract(number);

            console.log(add);

            if(add.toUpperCase != "0X0000000000000000000000000000000000000000"){

                const tokenId = Number(await contract?.raffleTokenId(number));
                
                const limitperWallet = Number(await contract?.ticketLimitPerWallet(number))
                const limit = Number(await contract?.ticketLimit(number));
                
                
                if(limit > 0){
                    setItemExists(true);
                    if(number > 4){
                        setPrice(String(await contract?.raffleEntryMaticCost(number)));
                    }
                    else{
                        setPrice(String(await contract?.raffleEntrySimpleCost(number)));
                    }
                    setLimit(limit);
                    setLimitPerWallet(limitperWallet);
                    setHolding(Number(await contract?.walletHolding(number, address)));
                    const contract721 = await setERC721(add);
        
                    const tokenURI = await contract721.tokenURI(tokenId);
                    console.log(tokenURI);
    
                    if(tokenURI[0] == "h"){
    
                        const metadata = tokenURI;
    
                        const meta = await fetch(metadata);
                        const json = await meta.json();
                        const name = json["name"];
                        const image = json["image"];
                        const newimage = `https://ipfs.io/ipfs/${image.substr(7)}`
        
                        console.log(newimage);
            
                        setWinner(await contract.winningAddress(number));
                        setTicketsSold(Number(await contract?.ticketsSold(number)));
                        setEntrants(Number(await contract?.totalEntrants(number)));
                        setName(name);
                        setImage(newimage);
    
                    }
    
                    else{
                        const metadata = `https://ipfs.io/ipfs/${tokenURI.substr(7)}`;
                        
                        const meta = await fetch(metadata);
                        const json = await meta.json();
                        const name = json["name"];
                        const image = json["image"];
                        const newimage = `https://ipfs.io/ipfs/${image.substr(7)}`
        
                        console.log(newimage);
            
                        setWinner(await contract.winningAddress(number));
                        setTicketsSold(Number(await contract?.ticketsSold(number)));
                        setEntrants(Number(await contract?.totalEntrants(number)));
                        setName(name);
                        setImage(newimage);
                    }
                        
    
                }
            }
            setLoadingRaffle(false);
        }

        catch(err){
            console.log(err);
            // setLoadingRaffle(false);

            setTimeout(fetchRaffle, 500);
        }
    }


    async function approve(){
        try{

            if(number <= 4){

                setLoading(true);
                console.log(ethers.utils.parseEther(String(amount*Number(ethers.utils.formatEther(price)))));
                const erc20contract = await setERC20();
    
                const allowance = await erc20contract.allowance(address, contractAdds.raffle);
    
                if(allowance < ethers.utils.parseEther(String(amount*Number(ethers.utils.formatEther(price)))) ){
                    console.log(erc20contract, ethers.utils.parseEther(String(amount*Number(ethers.utils.formatEther(price)))));
                    const txn = await erc20contract?.approve(contractAdds.raffle, ethers.utils.parseEther(String(amount*Number(ethers.utils.formatEther(price)))));
                    txn.wait().then((res)=>{
                        buytickets();
                    })
                }
    
                else{

                    buytickets();
                }
            }

            else{
                setLoading(true);
                buytickets();
            }
        }
        catch(err){
            console.log(err);
            setLoading(false);
        }
    }

    async function buytickets(){
        try{

            
            const contract = await setRaffle();


            if(number <= 4){
                const txn = await contract?.enterSimpleRaffle(number, amount);
                txn.wait().then((res)=>{
                    setLoading(false);
                    window.location.reload();
                })

            }

            else{
            console.log(amount*price);

                const txn = await contract?.enterMaticRaffle(number, amount, {value: ethers.utils.parseEther(ethers.utils.formatEther(String(price*amount)))});
                txn.wait().then((res)=>{
                    setLoading(false);
                    window.location.reload();
                })
            }
        }
        catch(err){
            console.log(err);
            setLoading(false);
        }


    }

    useEffect(()=>{
        fetchRaffle();
    },[])
    return(
        <div className="w-[20rem] relative h-fit text-center">
            <div className="bg-blue-500 z-[-1] top-2 left-2 absolute h-full w-full"></div>
            {loadingRaffle &&<div className="mx-auto flex items-center justify-center"> <InfinitySpin className="translate-x-10" visible={true} width="200" color="#ffffff" ariaLabel="infinity-spin-loading" /></div>}
            {itemExists ? <div className="bg-yellow-400 w-full p-5 mx-auto">
                <Image width={1920} height={1080} className="w-full bg-white min-[1500px]:w-[90%] mx-auto border-2 border-black" src={image}/>
                <h2 className="text-2xl bg-yellow-400 text-black w-fit mx-auto px-4 py-2 my-2">{name}</h2>
                <div className="grid grid-cols-2 gap-2">
                    <h2 className="bg-yellow-400 border-2 border-black text-black p-2">Participants: <br /> {entrants}</h2>
                    <h2 className="bg-yellow-400 border-2 border-black text-black p-2">Tickets Sold: <br /> {ticketsSold}/{limit}</h2>
                    <h2 className="bg-purple-400 col-span-2 text-white border-2 border-black py-2 w-full mx-auto">Your Tickets: {holding}/{limitPerWallet}</h2>
                </div>
                <h2 className="text-black bg-white w-fit rounded-t-none truncate py-2 px-4 mx-auto text-[1.2rem] border-x-2 border-black border-b-2">Price: {ethers.utils.formatEther(String(price))} {number>4 ? "$MATIC": "$SIMPLE"}</h2>
                {winner.toUpperCase() != "0X0000000000000000000000000000000000000000" ? <h2>Winner: {winner}</h2>:
                <button onClick={()=>{
                    setTicketModal(true);
                }} className="text-3xl bg-green-500 hover:bg-green-600 text-white px-5 py-3 mt-4">Buy Tickets</button>
                }
                
            </div> : 
            <div className="bg-yellow-400 w-full p-5 mx-auto flex items-center justify-center">
                {/* <Image width={1920} height={1080} src={noraffle} className="w-full border-2 border-black bg-white rounded-lg"/> */}
                <div className="w-full h-full text-black font-bold">NOTHING LISTED!</div>
                </div>}

                {ticketModal && <div className="bg-yellow-400 z-20 border-2 border-black rounded-2xl w-[300px] px-0 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl shadow-black">
                    <div className="relative flex flex-col items-center justify-center w-full h-full p-5 pt-10">
                        <h2 onClick={() => { setTicketModal(false) }} className="absolute top-0 right-0 cursor-pointer m-2 mx-4 text-black hover:text-red-600 transform hover:scale-125 transition-all duration-200 ease-in-out">x</h2>
                        {/* <input placeholder="0" type="number" onKeyDown={(e) => { e.preventDefault() }} step={1} min={0} onChange={handleamountChange} value={amount} className="text-black border-2 border-black p-5 py-4 text-center text-3xl block h-fit w-full rounded-xl">
                        </input> */}
                        <div className="grid grid-flow-col grid-cols-3 items-center gap-5">
                            <button onClick={()=>{changeAmount(-1)}} className="p-3">
                                <Image width={1920} height={1080} src={arrowright} className="w-[3rem] rotate-180"/>
                            </button>
                            <div className="text-[2.5rem] text-center text-black">{amount}</div>
                            <button onClick={()=>{changeAmount(1)}} className="p-3">
                                <Image width={1920} height={1080} src={arrowright} className="w-[3rem]"/>
                            </button>
                        </div>
                        
                        {!loading ? <button onClick={approve} className={` group py-4 px-8 text-white border-2 border-black text-3xl bg-blue-400`}>
                        Buy
                        </button>:
                         
                        <MutatingDots
                        visible={true}
                        height="100"
                        width="100"
                        color="#a855f7"
                        secondaryColor="#fff"
                        radius="12.5"
                        ariaLabel="mutating-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        />
                        }
                        
                    </div>
                </div>}
        </div>
    )
}