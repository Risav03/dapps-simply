"use client"

import Navbar from "./Navbar"
import { contractAdds } from "@/utils/contractAdds"
import burnerabi from "@/utils/abis/burnerabi"
import { useEffect, useState } from "react"
import token from "@/assets/coin.png"
import {ethers} from "ethers"
import {useAccount} from "wagmi"
import simplyNFTabi from "@/utils/abis/simplyNFTabi"

import Swal from "sweetalert2";
import { InfinitySpin } from "react-loader-spinner"
import callerabi from "@/utils/abis/callerabi"
import Image from "next/image";
import NFTCards from "./NFTCards"

export default function Burner(){

    const{address, isConnected} = useAccount();

    const[displayNFT, setDisplayNFT] = useState([]);
    const[loadingNFTs, setLoadingNFTs] = useState(false);

    const[selected, setSelected] = useState([]);
    const [cumulativeReward, setCumulativeReward] = useState(0);

    const [loadingBurning, setLoadingBurning] = useState(false);


    var counter = 0;

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

    async function approval(){
        try{
            console.log(selected.length)
            if(selected.length >0){

                setLoadingBurning(true);
                const contract = await simplyNFTSetup();
    
                var approvalStatus = true;
    
                for(let i = 0; i<selected.length; i++){
                    console.log(selected[i]);
                    const approved = await contract.getApproved(selected[i]);
                    console.log(approved);
    
                    if(approved.toLowerCase() == contractAdds.burner.toLowerCase()){
                        approvalStatus = true;
                        console.log("APPROVED");
                    }
    
                    else{
                        approvalStatus = false;
                        console.log("NOT APPROVED", contractAdds.burner);
                        const txn = await contract.setApprovalForAll(contractAdds.burner, true);
                        txn.wait().then((res)=>{
                            batchBurner();
                            
                        })
                        break;
                    }
    
                }
                if(approvalStatus){
                    console.log("approved All");
                    batchBurner();
                }
            
            
        }
        }
        catch(err){
            setLoadingBurning(false);
            console.log(err);
        }
    }

    async function dataProvider(index, contract){
        try{
            const response = await contract.fetchTokenURI(index);
            const balance = await contract.returnBalance();


            
                for(let i = 0; i< response.length; i++){
                    
                    try{
                        const uri = response[i][0];
                        const tokenId = Number(response[i][1]);
                        
                        const metadata = "https://ipfs.io/ipfs/" + uri.substr(7);
                        const meta = await fetch(metadata);
                        const json = await meta.json();
                        const name = json["name"];
                        const reward = await checkTraits(json["attributes"]);
                        const img = "https://ipfs.io/ipfs/" + json["image"].substr(7);
            
                        setDisplayNFT(oldArray => [...oldArray, {tokenId, name, img, uri, reward}]);
            
                        counter++;
                        if(balance == counter){
                            break;
                        }

                    }
                    catch(err){
                        console.log(err);
                        i--;
                    }
                    
                }

            
        }
        catch(err){
            console.log(err);
            dataProvider(index, contract);
            setLoadingNFTs(false);
        }


    }

    async function checkTraits(attr){
        try{

            
            var reward = 100;

            const attributeArr = attr;

            for(let i = 0; i<attributeArr.length; i++){
                const trait = attributeArr[i].trait_type;
                
                switch(trait){
                    case "Ability":
                        const value1 = attributeArr[i].value;
                        switch(value1){
                            case "Awareness":
                                reward = reward + 1;
                                break;
                            case "Clairvoyance":
                                reward = reward + 2;
                                break;
                            case "Enhanced Bite":
                                reward = reward + 3;
                                break;
                            case "Pain Suppression":
                                reward = reward + 4;
                                break;
                            case "Speed":
                                reward = reward + 5;
                                break;
                            case "Strength":
                                reward = reward + 6;
                                break;
                            case "Heat Vision":
                                reward = reward + 7;
                                break;
                            case "Agility":
                                reward = reward + 8;
                                break;
                            case "Danger Intuition":
                                reward = reward + 9;
                                break;
                            case "Indestructibility":
                                reward = reward + 10;
                                break;
                            case "Echolocation":
                                reward = reward + 11;
                                break;
                            case "Invincibility":
                                reward = reward + 12;
                                break;
                            case "Chemical Defenses":
                                reward = reward + 13;
                                break;
                            case "Regeneration":
                                reward = reward + 14;
                                break;
                            case "Flight":
                                reward = reward + 15;
                                break;
                            case "Mind Control":
                                reward = reward + 16;
                                break;
                            case "Immortality":
                                reward = reward + 17;
                                break;
                            case "Premonition":
                                reward = reward + 18;
                                break;
                            case "Super Senses":
                                reward = reward + 19;
                                break;
                            case "Fearless":
                                reward = reward + 20;
                                break;
                            case "Durability":
                                reward = reward + 21;
                                break;
                            case "Combat Trained":
                                reward = reward + 22;
                                break;
                            case "Survival":
                                reward = reward + 23;
                                break;
                            case "Artificial Intelligence":
                                reward = reward + 24;
                                break;
                            case "Hibernation":
                                reward = reward + 25;
                                break;
                            case "Levitation":
                                reward = reward + 26;
                                break;
                            case "Knight Vision":
                                reward = reward + 27;
                                break;
                            case "Invulnerability":
                                reward = reward + 28;
                                break;
                            case "Jumping Skills":
                                reward = reward + 29;
                                break;
                            case "Enhanced Smell":
                                reward = reward + 30;
                                break;
                            case "Telepathy":
                                reward = reward + 31;
                                break;
                            case "Memory":
                                reward = reward + 32;
                                break;
                            case "Breathe Under Water":
                                reward = reward + 33;
                                break;
                            case "Resurrection":
                                reward = reward + 34;
                                break;
                            case "Healing":
                                reward = reward + 35;
                                break;
                            case "Intellect":
                                reward = reward + 36;
                                break;
                            case "Invisibility":
                                reward = reward + 37;
                                break;
                            case "Shapeshifting":
                                reward = reward + 38;
                                break;
                            case "Telekinesis":
                                reward = reward + 39;
                                break;
                            case "Teleportation":
                                reward = reward + 40;
                                break;
                            case "Bioluminescent":
                                reward = reward + 41;
                                break;
                            case "Control Metals":
                                reward = reward + 42;
                                break;
                            case "Empathy":
                                reward = reward + 43;
                                break;
                            case "Fire Manipulation":
                                reward = reward + 44;
                                break;
                            case "Greed":
                                reward = reward + 45;
                                break;
                            case "Illusionist":
                                reward = reward + 46;
                                break;
                            case "Kindness":
                                reward = reward + 47;
                                break;
                            case "Retrocognition":
                                reward = reward + 48;
                                break;
                            case "See Spirits":
                                reward = reward + 49;
                                break;
                            case "See Through Walls":
                                reward = reward + 50;
                                break;
                            case "Self Destruct":
                                reward = reward + 50;
                                break;
                            case "Solar Energy Absorption":
                                reward = reward + 50;
                                break;
                            case "Time Travel":
                                reward = reward + 50;
                                break;
                            case "Ultimate Power":
                                reward = reward + 50;
                                break;
                            default:
                                console.log("Not a valid trait");
                                break;
                        }
                        break;  

                    case "Background":
                        const value2 = attributeArr[i].value;
                        switch(value2){
                            case "Purplish":
                                reward = reward + 1;
                                break;
                            case "Dark Blue":
                                reward = reward + 2;
                                break;
                            case "Beige":
                                reward = reward + 3;
                                break;
                            case "Olive":
                                reward = reward + 4;
                                break;
                            case "Lavender":
                                reward = reward + 5;
                                break;
                            case "Green":
                                reward = reward + 6;
                                break;
                            case "Pink":
                                reward = reward + 7;
                                break;
                            case "Cyan":
                                reward = reward + 8;
                                break;
                            case "Red":
                                reward = reward + 9;
                                break;
                            case "Black":
                                reward = reward + 10;
                                break;
                            case "Hunter":
                                reward = reward + 11;
                                break;
                            case "Blood":
                                reward = reward + 12;
                                break;
                            case "Morbid":
                                reward = reward + 13;
                                break;
                            case "Cobalt Blue":
                                reward = reward + 14;
                                break;
                            case "Magma":
                                reward = reward + 15;
                                break;
                            case "Grape":
                                reward = reward + 16;
                                break;
                            case "Bullion":
                                reward = reward + 17;
                                break;
                            case "Purple":
                                reward = reward + 18;
                                break;
                            case "Bloody Mary":
                                reward = reward + 19;
                                break;
                            case "Burnt Lion":
                                reward = reward + 20;
                                break;
                            case "Cyber Neon":
                                reward = reward + 21;
                                break;
                            case "Darkness":
                                reward = reward + 22;
                                break;
                            case "Ferrari Red":
                                reward = reward + 23;
                                break;
                            case "Heatwave":
                                reward = reward + 24;
                                break;
                            case "Midnight Blue":
                                reward = reward + 25;
                                break;
                            case "Misty":
                                reward = reward + 26;
                                break;
                            case "Radioactive":
                                reward = reward + 27;
                                break;
                            case "Retro Gaming Green":
                                reward = reward + 28;
                                break;
                            case "Shocking Pink":
                                reward = reward + 29;
                                break;
                            case "Simple Blue":
                                reward = reward + 30;
                                break;
                            case "Ultra Pink":
                                reward = reward + 31;
                                break;
                            case "Water":
                                reward = reward + 32;
                                break;

                            default:
                                console.log("Invalid Trait");
                                break;
                        }
                        break;

                    case "Bone Type":
                        const value3 = attributeArr[i].value;
                        switch(value3){
                            case "Grey":
                                reward = reward + 1;
                                break;
                            case "Sapphire":
                                reward = reward + 2;
                                break;
                            case "Charcoal Grey":
                                reward = reward + 3;
                                break;
                            case "Amethyst":
                                reward = reward + 4;
                                break;
                            case "Fossil Grey":
                                reward = reward + 5;
                                break;
                            case "Peridot":
                                reward = reward + 6;
                                break;
                            case "Crimson":
                                reward = reward + 7;
                                break;
                            case "Hot":
                                reward = reward + 8;
                                break;
                            case "Purple Shade":
                                reward = reward + 9;
                                break;
                            case "Emerald":
                                reward = reward + 10;
                                break;
                            case "Gold":
                                reward = reward + 11;
                                break;
                            case "Pink Splash":
                                reward = reward + 12;
                                break;
                            case "Exposed":
                                reward = reward + 13;
                                break;
                            case "Inverted":
                                reward = reward + 14;
                                break;
                            case "Poison Apple":
                                reward = reward + 15;
                                break;

                            default:
                                console.log("Invalid Trait");
                                break;
                        }
                        break;
                    
                    case "Clothing":
                        const value4 = attributeArr[i].value;
                        switch(value4){
                            case "Jumper Sky Blue":
                                reward = reward + 1;
                                break;
                            case "Jumper Purple Passion":
                                reward = reward + 2;
                                break;
                            case "Jumper Sea Blue":
                                reward = reward + 3;
                                break;
                            case "Jumper Disco Pink":
                                reward = reward + 4;
                                break;
                            case "Jumper Red Peach":
                                reward = reward + 5;
                                break;
                            case "Jumper Chocolate Orange":
                                reward = reward + 6;
                                break;
                            case "Skull Shirt":
                                reward = reward + 7;
                                break;
                            case "Jacket Leather":
                                reward = reward + 8;
                                break;
                            case "Jumper Lime":
                                reward = reward + 9;
                                break;
                            case "Jacket Denim":
                                reward = reward + 10;
                                break;
                            case "Suit Black":
                                reward = reward + 11;
                                break;
                            case "Tracksuit Red":
                                reward = reward + 12;
                                break;
                            case "Jumper Cyan":
                                reward = reward + 13;
                                break;
                            case "Hoodie Grey":
                                reward = reward + 14;
                                break;
                            case "Jumper Brown":
                                reward = reward + 15;
                                break;
                            case "Jumper Yellow":
                                reward = reward + 16;
                                break;
                            case "Priest Outfit":
                                reward = reward + 17;
                                break;
                            case "Open Shirt Purple":
                                reward = reward + 18;
                                break;
                            case "Tie Black":
                                reward = reward + 19;
                                break;
                            case "Lumber Shirt Red":
                                reward = reward + 20;
                                break;
                            case "Tracksuit Blue":
                                reward = reward + 21;
                                break;
                            case "Tie Red":
                                reward = reward + 22;
                                break;
                            case "Torn Jumper Green":
                                reward = reward + 23;
                                break;
                            case "Jumper Denim":
                                reward = reward + 24;
                                break;
                            case "Torn Jumper Brown":
                                reward = reward + 25;
                                break;
                            case "Torn Jumper Red":
                                reward = reward + 26;
                                break;
                            case "Torn Jumper Blue":
                                reward = reward + 27;
                                break;
                            case "Lumber Shirt Green":
                                reward = reward + 28;
                                break;
                            case "Flower Shirt":
                                reward = reward + 29;
                                break;
                            case "Cardigan":
                                reward = reward + 30;
                                break;
                            case "Mankini":
                                reward = reward + 31;
                                break;
                            case "Shirt Green":
                                reward = reward + 32;
                                break;
                            case "Special Ops Jumper":
                                reward = reward + 33;
                                break;
                            case "Jumper Grey With Blood":
                                reward = reward + 34;
                                break;
                            case "Torn Jumper Grey":
                                reward = reward + 35;
                                break;
                            case "Open Shirt Orange":
                                reward = reward + 36;
                                break;
                            case "Backpack":
                                reward = reward + 37;
                                break;
                            case "Pelt Green":
                                reward = reward + 38;
                                break;
                            case "Open Shirt Green":
                                reward = reward + 39;
                                break;
                            case "Sweater Blue":
                                reward = reward + 40;
                                break;
                            case "Sweater Red":
                                reward = reward + 41;
                                break;
                            case "Torn Blood Stained Shirt":
                                reward = reward + 42;
                                break;
                            case "Blood Stained Shirt":
                                reward = reward + 43;
                                break;
                            case "Cloak":
                                reward = reward + 44;
                                break;
                            case "Pelt Orange":
                                reward = reward + 45;
                                break;
                            case "Devil Wings":
                                reward = reward + 46;
                                break;
                            case "Collar":
                                reward = reward + 47;
                                break;
                            case "Cape":
                                reward = reward + 48;
                                break;
                            case "Dungarees":
                                reward = reward + 49;
                                break;

                            default:
                                console.log("Invalid Trait");
                                break;
                        }
                        break;

                    case "Eyes" :
                        const value5 = attributeArr[i].value;
                        switch(value5){
                            case "Cute Eyes":
                                reward = reward + 1;
                                break;
                            case "Small Eyes":
                                reward = reward + 2;
                                break;
                            case "Yellow Eyes":
                                reward = reward + 3;
                                break;
                            case "Red Eyes":
                                reward = reward + 4;
                                break;
                            case "White Eyes":
                                reward = reward + 5;
                                break;
                            case "Pink Eyes":
                                reward = reward + 6;
                                break;
                            case "Green Eyes":
                                reward = reward + 7;
                                break;
                            case "Angry Eyes Yellow":
                                reward = reward + 8;
                                break;
                            case "Angry Eyes White":
                                reward = reward + 9;
                                break;
                            case "Close Eyes":
                                reward = reward + 10;
                                break;
                            case "Laser Eyes Green":
                                reward = reward + 11;
                                break;
                            case "Angry Eyes Red":
                                reward = reward + 12;
                                break;
                            case "Orange Eyes":
                                reward = reward + 13;
                                break;
                            case "High Brows":
                                reward = reward + 14;
                                break;
                            case "Laser Eyes Blue":
                                reward = reward + 15;
                                break;
                            case "With Brows":
                                reward = reward + 16;
                                break;
                            case "Tired Eyes":
                                reward = reward + 17;
                                break;
                            case "Blue Eyes":
                                reward = reward + 18;
                                break;
                            case "Laser Eyes Red":
                                reward = reward + 19;
                                break;
                            case "Angry Eyes":
                                reward = reward + 20;
                                break;
                            case "Robot Eye":
                                reward = reward + 21;
                                break;
                            case "Glowing Visor Pink":
                                reward = reward + 22;
                                break;
                            case "Angry Brows":
                                reward = reward + 23;
                                break;
                            case "Glowing Visor Green":
                                reward = reward + 24;
                                break;
                            case "LED Eyes Red":
                                reward = reward + 25;
                                break;
                            case "Wink Eyes":
                                reward = reward + 26;
                                break;
                            case "LED Eyes Green":
                                reward = reward + 27;
                                break;
                            case "Laser Eyes Pink":
                                reward = reward + 28;
                                break;
                            case "Black Eyes":
                                reward = reward + 29;
                                break;
                            case "Prison Tear":
                                reward = reward + 30;
                                break;

                            default:
                                console.log("Invalid Trait");
                                break;
                        }
                        break;

                    case "Eyeware":
                        const value6 = attributeArr[i].value;
                        switch(value6){
                            case "Red Shades":
                                reward = reward + 1;
                                break;
                            case "Pink Shades":
                                reward = reward + 2;
                                break;
                            case "Purple Shades":
                                reward = reward + 3;
                                break;
                            case "Red Glasses":
                                reward = reward + 4;
                                break;
                            case "Orange Shades":
                                reward = reward + 5;
                                break;
                            case "Purple Glasses":
                                reward = reward + 6;
                                break;
                            case "Green Shades":
                                reward = reward + 7;
                                break;
                            case "Yellow Shades":
                                reward = reward + 8;
                                break;
                            case "Green Glasses":
                                reward = reward + 9;
                                break;
                            case "Cyan Shades":
                                reward = reward + 10;
                                break;
                            case "Blue Glasses":
                                reward = reward + 11;
                                break;
                            case "Blue Shades":
                                reward = reward + 12;
                                break;
                            case "Dark Shades":
                                reward = reward + 13;
                                break;
                            case "Small Shades":
                                reward = reward + 14;
                                break;
                            case "Dark Glasses":
                                reward = reward + 15;
                                break;
                            case "Thug Shades":
                                reward = reward + 16;
                                break;
                            case "Eye Patch":
                                reward = reward + 17;
                                break;
                            case "Cross":
                                reward = reward + 18;
                                break;
                            case "Upside Down Cross":
                                reward = reward + 19;
                                break;

                            default:
                                console.log("Invalid Trait");
                                break;
                        }
                        break;

                    case "Face Mask":
                        const value7 = attributeArr[i].value;
                        switch (value7){
                            case "Face Mask":
                                reward = reward + 1;
                                break;
                            case "Black Face Cover":
                                reward = reward + 2;
                                break;

                            default:
                                console.log("Invalid Trait");
                                break;
                        }
                        break;

                    case "Full Outfit":
                        const value8 = attributeArr[i].value;
                        switch(value8){

                            case "Camo Outfit Swedish":
                                reward = reward + 1;
                                break;
                            case "Camo Outfit White":
                                reward = reward + 2;
                                break;
                            case "Camo Outfit China":
                                reward = reward + 3;
                                break;
                            case "Deer Hunter Outfit":
                                reward = reward + 4;
                                break;
                            case "Militant Outfit":
                                reward = reward + 5;
                                break;
                            case "Camo Outfit Desert":
                                reward = reward + 6;
                                break;
                            case "Camo Outfit Navy":
                                reward = reward + 7;
                                break;
                            case "Police Outfit":
                                reward = reward + 8;
                                break;
                            case "Prison Outfit":
                                reward = reward + 9;
                                break;
                            case "Camo Outfit Green":
                                reward = reward + 10;
                                break;
                            case "Camo Outfit Pink":
                                reward = reward + 11;
                                break;
                            case "Jungle Warfare Outfit":
                                reward = reward + 12;
                                break;
                            case "Camo Outfit Orange":
                                reward = reward + 13;
                                break;
                            case "Military Outfit":
                                reward = reward + 14;
                                break;

                            default:
                                console.log("Invalid Trait");
                                break;
                        }
                        break;

                    case "Hats And Hair":
                        const value9 = attributeArr[i].value;
                        switch(value9){
                            
                            case "Rock Star Hair":
                                reward = reward + 1;
                                break;
                            case "Short Hair":
                                reward = reward + 2;
                                break;
                            case "Cap Sky Blue":
                                reward = reward + 3;
                                break;
                            case "Cap Purple Passion":
                                reward = reward + 4;
                                break;
                            case "Cap Disco Pink":
                                reward = reward + 5;
                                break;
                            case "Side Hair":
                                reward = reward + 6;
                                break;
                            case "Pirate Hat":
                                reward = reward + 7;
                                break;
                            case "Small Cap Denim":
                                reward = reward + 8;
                                break;
                            case "Small Cap Disco Pink":
                                reward = reward + 9;
                                break;
                            case "Small Cap Purple Passion":
                                reward = reward + 10;
                                break;
                            case "Messy Hair":
                                reward = reward + 11;
                                break;
                            case "Cap Chocolate Orange":
                                reward = reward + 12;
                                break;
                            case "Skull Bandana":
                                reward = reward + 13;
                                break;
                            case "Small Cap Brown":
                                reward = reward + 14;
                                break;
                            case "Flow Haircut":
                                reward = reward + 15;
                                break;
                            case "Cap Lime":
                                reward = reward + 16;
                                break;
                            case "Big Hair":
                                reward = reward + 17;
                                break;
                            case "Cap Sea Blue":
                                reward = reward + 18;
                                break;
                            case "Parted Hair":
                                reward = reward + 19;
                                break;
                            case "Field Cap Purple Passion":
                                reward = reward + 20;
                                break;
                            case "Field Cap Sea Blue":
                                reward = reward + 21;
                                break;
                            case "Headphones Pink":
                                reward = reward + 22;
                                break;
                            case "Field Cap Sky Blue":
                                reward = reward + 23;
                                break;
                            case "Hat Sea Blue":
                                reward = reward + 24;
                                break;
                            case "Hat Sky Blue":
                                reward = reward + 25;
                                break;
                            case "Slick Hair":
                                reward = reward + 26;
                                break;
                            case "Cap Cyan":
                                reward = reward + 27;
                                break;
                            case "Caesar Haircut":
                                reward = reward + 28;
                                break;
                            case "Punk Hair":
                                reward = reward + 29;
                                break;
                            case "Cap Brown":
                                reward = reward + 30;
                                break;
                            case "Field Cap Red Peach":
                                reward = reward + 31;
                                break;
                            case "Field Cap Disco Pink":
                                reward = reward + 32;
                                break;
                            case "Field Cap Yellow":
                                reward = reward + 33;
                                break;
                            case "Flat Cap Brown":
                                reward = reward + 34;
                                break;
                            case "Hat Disco Pink":
                                reward = reward + 35;
                                break;
                            case "Hat Purple Passion":
                                reward = reward + 36;
                                break;
                            case "Flat Cap Denim":
                                reward = reward + 37;
                                break;
                            case "Rock Star Hair Red":
                                reward = reward + 38;
                                break;
                            case "Cap Red Peach":
                                reward = reward + 39;
                                break;
                            case "Field Cap Chocolate Orange":
                                reward = reward + 40;
                                break;
                            case "Mullet Hair":
                                reward = reward + 40;
                                break;
                            case "Cap Yellow":
                                reward = reward + 40;
                                break;
                            case "Hat Yellow":
                                reward = reward + 40;
                                break;
                            case "Hat Red Peach":
                                reward = reward + 40;
                                break;
                            case "Brain Right":
                                reward = reward + 40;
                                break;
                            case "Top Hat":
                                reward = reward + 40;
                                break;
                            case "Cap Backwards Black":
                                reward = reward + 40;
                                break;
                            case "Hat Brown":
                                reward = reward + 40;
                                break;
                            case "Field Cap Brown":
                                reward = reward + 40;
                                break;
                            case "Hat Chocolate Orange":
                                reward = reward + 40;
                                break;
                            case "Long Top Short Sides":
                                reward = reward + 40;
                                break;
                            case "Field Cap Lime":
                                reward = reward + 40;
                                break;
                            case "Hat Cyan":
                                reward = reward + 40;
                                break;
                            case "Flat Cap Yellow":
                                reward = reward + 40;
                                break;
                            case "Hat Denim":
                                reward = reward + 40;
                                break;
                            case "Hat Lime":
                                reward = reward + 40;
                                break;
                            case "Red Horns":
                                reward = reward + 40;
                                break;
                            case "Brain Left":
                                reward = reward + 40;
                                break;
                            case "Field Cap Cyan":
                                reward = reward + 40;
                                break;
                            case "Side Parting":
                                reward = reward + 40;
                                break;
                            case "Rave Buns":
                                reward = reward + 40;
                                break;
                            case "Hole In Head":
                                reward = reward + 40;
                                break;
                            case "Black Horns":
                                reward = reward + 40;
                                break;
                            case "Cap Denim":
                                reward = reward + 40;
                                break;
                            case "Field Cap Denim":
                                reward = reward + 40;
                                break;
                            case "Wind Swept Hair":
                                reward = reward + 40;
                                break;
                            case "Silver Fox":
                                reward = reward + 40;
                                break;
                            case "Comb Over":
                                reward = reward + 40;
                                break;
                            case "Vampire Hat":
                                reward = reward + 40;
                                break;
                            case "Red Blood":
                                reward = reward + 40;
                                break;
                            case "Bandana Blue":
                                reward = reward + 40;
                                break;
                            case "Explorer Hat":
                                reward = reward + 40;
                                break;
                            case "Buntal Hat":
                                reward = reward + 40;
                                break;
                            case "Power Quiff":
                                reward = reward + 40;
                                break;

                            case "Flat Cap Cyan":
                                reward = reward + 40;
                                break;
                            case "Bone Horns":
                                reward = reward + 40;
                                break;
                            case "Mohawk Black":
                                reward = reward + 40;
                                break;
                            case "Bandana Red":
                                reward = reward + 40;
                                break;
                            case "Bowler Hat":
                                reward = reward + 40;
                                break;
                            case "Hat Backwards":
                                reward = reward + 40;
                                break;
                            case "Widows Peak":
                                reward = reward + 40;
                                break;
                            case "Coloured Buns":
                                reward = reward + 40;
                                break;
                            case "Balaclava Black":
                                reward = reward + 40;
                                break;
                            case "Gamer Cap":
                                reward = reward + 40;
                                break;
                            case "Afro":
                                reward = reward + 40;
                                break;
                            case "Cap Backwards":
                                reward = reward + 40;
                                break;
                            case "Curly Hair":
                                reward = reward + 40;
                                break;
                            case "Dreadlocks":
                                reward = reward + 40;
                                break;
                            case "Brain":
                                reward = reward + 40;
                                break;
                            case "Transmitter":
                                reward = reward + 40;
                                break;
                            case "Wind Swept Hair Purple":
                                reward = reward + 40;
                                break;
                            case "Antenna":
                                reward = reward + 40;
                                break;
                            case "Spiked":
                                reward = reward + 40;
                                break;
                            case "Straight Hair":
                                reward = reward + 40;
                                break;
                            case "Do Rag":
                                reward = reward + 40;
                                break;
                            case "Scruffy Mullet":
                                reward = reward + 40;
                                break;
                            case "Slicked Back Hair":
                                reward = reward + 50;
                                break;
                            case "Viking Helmet Gold":
                                reward = reward + 50;
                                break;
                            case "Curl":
                                reward = reward + 50;
                                break;
                            case "Green Blood":
                                reward = reward + 50;
                                break;
                            case "Blue Blood":
                                reward = reward + 50;
                                break;
                            case "Crown Gold":
                                reward = reward + 50;
                                break;
                            case "Grey Stripe":
                                reward = reward + 50;
                                break;
                            case "Pink Blood":
                                reward = reward + 50;
                                break;
                            case "Mad Scientist Hair":
                                reward = reward + 50;
                                break;
                            case "Power Quiff Purple":
                                reward = reward + 50;
                                break;

                            default:
                                console.log("Invalid Trait!");
                                break;
                        }
                        break;

                    case "Jewellery":
                        const value10 = attributeArr[i].value;
                        switch(value10){

                            case "Gold Earring":
                                reward = reward + 1;
                                break;
                            case "Silver Earring":
                                reward = reward + 2;
                                break;
                            case "Gold Tooth":
                                reward = reward + 3;
                                break;
                            case "Blue Earring":
                                reward = reward + 4;
                                break;
                            case "Pink Earring":
                                reward = reward + 5;
                                break;
                            case "Red Earring":
                                reward = reward + 6;
                                break;
                            case "Green Earring":
                                reward = reward + 7;
                                break;

                            default:
                            console.log("Invalid Input!");
                            break;
                        }
                        break;

                    case "Magic Power":
                        const value11 = attributeArr[i].value;
                        switch(value11){

                            case "Neon Ring Pink":
                                reward = reward + 1;
                                break;
                            case "Ritualism":
                                reward = reward + 2;
                                break;
                            case "Vocifery":
                                reward = reward + 3;
                                break;
                            case "Evolution":
                                reward = reward + 4;
                                break;
                            case "Sorcery":
                                reward = reward + 5;
                                break;
                            case "Neon Ring Green":
                                reward = reward + 6;
                                break;
                            case "Voodoo":
                                reward = reward + 7;
                                break;
                            case "Zombie Immunity":
                                reward = reward + 8;
                                break;
                            case "Neon Ring Red":
                                reward = reward + 9;
                                break;
                            case "Red Glow":
                                reward = reward + 10;
                                break;
                            case "Green Glow":
                                reward = reward + 11;
                                break;
                            case "Pink Glow":
                                reward = reward + 12;
                                break;
                            case "Spell Casting":
                                reward = reward + 13;
                                break;
                            case "Wish Granting":
                                reward = reward + 14;
                                break;
                            case "Blue Glow":
                                reward = reward + 15;
                                break;
                            case "Hide In Plain Sight":
                                reward = reward + 16;
                                break;
                            case "Speed Of Light":
                                reward = reward + 17;
                                break;
                            case "Witchcraft":
                                reward = reward + 18;
                                break;
                            case "Summoning":
                                reward = reward + 19;
                                break;
                            case "White Glow":
                                reward = reward + 20;
                                break;
                            case "Electric":
                                reward = reward + 21;
                                break;
                            case "Beam Me Up":
                                reward = reward + 22;
                                break;
                            case "Burning Barium":
                                reward = reward + 23;
                                break;
                            case "Fire":
                                reward = reward + 24;
                                break;
                            case "Flaming":
                                reward = reward + 25;
                                break;
                            case "Ice":
                                reward = reward + 26;
                                break;
                            case "Midas Touch":
                                reward = reward + 27;
                                break;
                            case "Regeneration":
                                reward = reward + 28;
                                break;
                            case "Stop Time":
                                reward = reward + 29;
                                break;
                            case "Time Travel":
                                reward = reward + 30;
                                break;
                            case "Walk Through Walls":
                                reward = reward + 31;
                                break;

                            default:
                            console.log("Invalid Input!");
                            break;
                            }
                        break;

                    case "Metal Type":
                        const value12 = attributeArr[i].value;
                        switch(value12){

                            case "Steel Bot":
                                reward = reward + 20;
                                break;
                            case "Gold Bot":
                                reward = reward + 30;
                                break;
                            case "Stealth Bot":
                                reward = reward + 50;
                                break;

                            default:
                                console.log("Invalid Trait!");
                                break;

                        }
                        break;

                    case "Mouth":
                        const value13 = attributeArr[i].value;
                        switch(value13){
                            case "Small Mouth":
                                reward = reward + 1;
                                break;
                            case "Long Mouth":
                                reward = reward + 2;
                                break;
                            case "Tongue Mouth":
                                reward = reward + 3;
                                break;
                            case "Straight Mouth":
                                reward = reward + 4;
                                break;
                            case "Open Mouth":
                                reward = reward + 5;
                                break;
                            case "Buck Tooth":
                                reward = reward + 6;
                                break;
                            case "Blood Mouth":
                                reward = reward + 7;
                                break;
                            case "Showing Tongue":
                                reward = reward + 8;
                                break;
                            case "One Eater":
                                reward = reward + 9;
                                break;
                            case "Vampire Teeth":
                                reward = reward + 10;
                                break;
                            case "Rainbow Vomit":
                                reward = reward + 11;
                                break;
                            case "Showing Teeth":
                                reward = reward + 12;
                                break;
                        }
                        break;

                    case "Personality":
                        const value14 = attributeArr[i].value;
                        switch(value14){

                            case "Good":
                                reward = reward + 1;
                                break;
                            case "Bad":
                                reward = reward + 2;
                                break;
                            case "Evil":
                                reward = reward + 3;
                                break;

                            default:
                                console.log("Invalid Trait");
                                break; 

                        }
                        break;

                    case "Protective Clothing":
                        const value15 = attributeArr[i].value;
                        switch(value15){

                            case "Ninja Cat Outfit Black":
                                reward = reward + 1;
                                break;
                            case "Knight Outfit":
                                reward = reward + 2;
                                break;
                            case "Special Forces":
                                reward = reward + 3;
                                break;
                            case "Ninja Cat Outfit Blue":
                                reward = reward + 4;
                                break;
                            case "Hazmat Suit Grey":
                                reward = reward + 5;
                                break;
                            case "Hazmat Suit Pink":
                                reward = reward + 6;
                                break;
                            case "Hazmat Suit Blue":
                                reward = reward + 7;
                                break;
                            case "Hazmat Suit Purple":
                                reward = reward + 8;
                                break;
                            case "Hazmat Suit Orange":
                                reward = reward + 9;
                                break;
                            case "Power Up Suit Purple":
                                reward = reward + 10;
                                break;
                            case "Knight Outfit Gold":
                                reward = reward + 11;
                                break;
                            case "Ninja Cat Outfit Purple":
                                reward = reward + 12;
                                break;
                            case "Power Up Suit Blue":
                                reward = reward + 13;
                                break;
                            case "Hazmat Suit Yellow":
                                reward = reward + 14;
                                break;
                            case "Power Up Suit Green":
                                reward = reward + 15;
                                break;
                            case "Diver":
                                reward = reward + 16;
                                break;
                            case "Green Armour":
                                reward = reward + 17;
                                break;
                            case "Pink Armour":
                                reward = reward + 18;
                                break;
                            case "Hazmat Suit Cyan":
                                reward = reward + 19;
                                break;
                            case "Power Up Suit Grey":
                                reward = reward + 20;
                                break;
                            case "Hazmat Suit Gold":
                                reward = reward + 21;
                                break;

                            default:
                                console.log("Invalid Trait!");
                                break;
                        }
                        break;

                    case "Skin Type":
                        const value16 = attributeArr[i].value;
                        switch(value16){
                            case "Pickle Green":
                                reward = reward + 1;
                                break;
                            case "Burgundy":
                                reward = reward + 2;
                                break;
                            case "Light Brown":
                                reward = reward + 3;
                                break;
                            case "Tanned":
                                reward = reward + 4;
                                break;
                            case "Light Orange":
                                reward = reward + 5;
                                break;
                            case "Brown":
                                reward = reward + 6;
                                break;
                            case "Light Grey":
                                reward = reward + 7;
                                break;
                            case "Orange":
                                reward = reward + 8;
                                break;
                            case "Grey":
                                reward = reward + 9;
                                break;
                            case "Dark Blue":
                                reward = reward + 10;
                                break;
                            case "Nice Grey":
                                reward = reward + 11;
                                break;
                            case "Pale":
                                reward = reward + 12;
                                break;
                            case "Dark Grey":
                                reward = reward + 13;
                                break;
                            case "Cardinal Red":
                                reward = reward + 14;
                                break;
                            case "Porcelain White":
                                reward = reward + 15;
                                break;
                            case "Lavender":
                                reward = reward + 16;
                                break;
                            case "Mint":
                                reward = reward + 17;
                                break;
                            case "Carolina Blue":
                                reward = reward + 18;
                                break;
                            case "Crimson":
                                reward = reward + 19;
                                break;
                            case "Dried Plums":
                                reward = reward + 20;
                                break;
                            case "Plum":
                                reward = reward + 21;
                                break;
                            case "Shadow":
                                reward = reward + 22;
                                break;
                            case "Video Degradation":
                                reward = reward + 23;
                                break;
                            case "Cyan":
                                reward = reward + 24;
                                break;
                            case "Raspberry":
                                reward = reward + 25;
                                break;
                            case "Exposed":
                                reward = reward + 26;
                                break;
                            case "Purple":
                                reward = reward + 27;
                                break;
                            case "Blue Violet":
                                reward = reward + 28;
                                break;
                            case "Bubblegum Pink":
                                reward = reward + 29;
                                break;
                            case "Burning":
                                reward = reward + 30;
                                break;
                            case "Dreamsicle":
                                reward = reward + 31;
                                break;
                            case "Fuchsia":
                                reward = reward + 32;
                                break;
                            case "Garnet":
                                reward = reward + 33;
                                break;
                            case "LCD Green":
                                reward = reward + 34;
                                break;
                            case "Lava":
                                reward = reward + 35;
                                break;
                            case "Lilac":
                                reward = reward + 36;
                                break;
                            case "Luminous":
                                reward = reward + 37;
                                break;
                            case "Onyx":
                                reward = reward + 38;
                                break;
                            case "Ruby":
                                reward = reward + 39;
                                break;
                            case "Slime":
                                reward = reward + 40;
                                break;
                            case "Transparent":
                                reward = reward + 41;
                                break;
                            case "Turquenite":
                                reward = reward + 42;
                                break;
                            case "Vintage":
                                reward = reward + 43;
                                break;
                            case "Wet":
                                reward = reward + 44;
                                break;

                            default:
                                console.log("Invalid Trait");
                                break;
                        }
                        break;

                    case "Type":
                        const value17 = attributeArr[i].value;
                        switch(value17){

                            case "Earthling":
                                reward = reward + 1;
                                break;
                            case "Zombie":
                                reward = reward + 2;
                                break;
                            case "Skull":
                                reward = reward + 3;
                                break;
                            case "Devil":
                                reward = reward + 4;
                                break;
                            case "Vampire":
                                reward = reward + 5;
                                break;
                            case "Big Nug":
                                reward = reward + 6;
                                break;
                            case "Floating Skull":
                                reward = reward + 7;
                                break;
                            case "Robot":
                                reward = reward + 8;
                                break;
                            case "Long Head":
                                reward = reward + 9;
                                break;
                            case "Alien":
                                reward = reward + 10;
                                break;
                            case "Mega Swede":
                                reward = reward + 11;
                                break;
                            case "Cyber Goat":
                                reward = reward + 12;
                                break;
                            case "Shadow Master":
                                reward = reward + 13;
                                break;
                            case "Floating Head":
                                reward = reward + 14;
                                break;
                            case "Cyborg":
                                reward = reward + 15;
                                break;
                            case "Electron":
                                reward = reward + 16;
                                break;
                            case "Antique":
                                reward = reward + 17;
                                break;
                            case "Aquatic":
                                reward = reward + 18;
                                break;
                            case "Cotton Candy":
                                reward = reward + 19;
                                break;
                            case "Fire Boss":
                                reward = reward + 20;
                                break;
                            case "Gamer":
                                reward = reward + 21;
                                break;
                            case "Gleaming":
                                reward = reward + 22;
                                break;
                            case "Inferno":
                                reward = reward + 23;
                                break;
                            case "Neo":
                                reward = reward + 24;
                                break;
                            case "Phantom":
                                reward = reward + 25;
                                break;
                            case "Rage":
                                reward = reward + 26;
                                break;
                            case "Refreshing":
                                reward = reward + 27;
                                break;
                            case "Spooky":
                                reward = reward + 28;
                                break;
                            case "Toxic":
                                reward = reward + 29;
                                break;

                            default:
                                console.log("Invalid Trait!");
                                break;

                        }
                        break;

                    case "Weapon":
                        const value18 = attributeArr[i].value;
                        switch(value18){

                            case "Spear":
                                reward = reward + 1;
                                break;
                            case "Small Knife":
                                reward = reward + 2;
                                break;
                            case "Sword":
                                reward = reward + 3;
                                break;
                            case "Wooden Sword":
                                reward = reward + 4;
                                break;
                            case "Sword With Blood":
                                reward = reward + 5;
                                break;
                            case "Fire Stick":
                                reward = reward + 6;
                                break;
                            case "Stick":
                                reward = reward + 7;
                                break;
                            case "Poison Arrow":
                                reward = reward + 8;
                                break;
                            case "Meat Cleaver":
                                reward = reward + 9;
                                break;
                            case "Skull Stick":
                                reward = reward + 10;
                                break;
                            case "Fire Sword":
                                reward = reward + 11;
                                break;
                            case "Laser Sword Blue":
                                reward = reward + 12;
                                break;
                            case "Dark Sword":
                                reward = reward + 13;
                                break;
                            case "Laser Sword Red":
                                reward = reward + 14;
                                break;
                            case "Gold Knife":
                                reward = reward + 15;
                                break;
                            case "Fork":
                                reward = reward + 16;
                                break;
                            case "Laser Sword Green":
                                reward = reward + 17;
                                break;
                            case "Lead Pipe":
                                reward = reward + 18;
                                break;
                            case "Gold Sword With Blood":
                                reward = reward + 19;
                                break;
                            case "Probe Blue":
                                reward = reward + 20;
                                break;
                            case "Big Chopper":
                                reward = reward + 21;
                                break;
                            case "Double Laser Sword Green":
                                reward = reward + 22;
                                break;
                            case "Double Laser Sword Red":
                                reward = reward + 23;
                                break;
                            case "Finger":
                                reward = reward + 24;
                                break;
                            case "Laser Sword Pink":
                                reward = reward + 25;
                                break;
                            case "Probe Red":
                                reward = reward + 26;
                                break;
                            case "Crimson Sword":
                                reward = reward + 27;
                                break;
                            case "Double Laser Sword Pink":
                                reward = reward + 28;
                                break;
                            case "Double Long Sword":
                                reward = reward + 29;
                                break;
                            case "Gold Spear":
                                reward = reward + 30;
                                break;
                            case "Hand Gun":
                                reward = reward + 31;
                                break;
                            case "Hot Sword":
                                reward = reward + 32;
                                break;
                            case "Long Sword Gold":
                                reward = reward + 33;
                                break;
                            case "Magic Ball Pink":
                                reward = reward + 34;
                                break;
                            case "Probe Pink":
                                reward = reward + 35;
                                break;

                            default:
                                console.log("Invalid Trait!");
                                break;

                        }
                        break;

                    default:
                        console.log("HUH?");
                        break;
                }

                
            }

            return reward;
            

        }
        catch(err){
            console.log(err);
        }
    }


    async function fetchNFTs(){
        try{
        
            setLoadingNFTs(true);
            const contract = await burningSetup();

            const balance = await contract.returnBalance();


            for(let j  = 0; j<40; j++){
                try{

                    if(counter == balance){
                        setLoadingNFTs(false);
                        break;
                    }

                    else{
                        const txn = await dataProvider(j, contract);
                        txn.wait();
                    }
                }
                catch(err){
                    console.log(err);
                    j--;
                }
                

            }

        }
        catch(err){
            console.log(err);
            setLoadingNFTs(false);
            fetchNFTs();
            
        }
    }

    async function batchBurner(){
        try{

            const contract = await callerSetup();

            const txn = await contract.batchBurn(selected, ethers.utils.parseEther(String(cumulativeReward-100)));

            txn.wait().then((res)=>{
                setLoadingBurning(false);
                Swal.fire({
                    icon: "success",
                    title: "Items Burnt!",
                    showConfirmButton: false,
                    timer: 1500
                  }).then((res)=>{window.location.reload();})
            })
        }
        catch(err){
            setLoadingBurning(false);
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Items not Burnt!",
                timer: 1500,
                showConfirmButton: false
              }).then((res)=>{})
        }
    }

    useEffect(()=>{

        if(isConnected)
        fetchNFTs();
    },[isConnected])

    return(
        <div className="sm:p-12 p-4 overflow-hidden">
            
            <Navbar/>
            <h1 className="text-6xl mt-5 font-bold">SIMPLY <span className="bg-gradient-to-b from-orange-600 to-orange-400 text-transparent bg-clip-text">Burner</span></h1>
            <p className="mt-4 text-xl sm:flex items-center">Burn your SIMPLY NFT & earn <span className="hidden sm:flex"><Image src={token} width={1920} height={1080} className="w-[3.5rem] mx-3 -rotate-12" /></span> <span className="sm:hidden">$SIMPLE</span> based on its traits!</p>

            <a className=" block text-xs underline text-blue-400" href="https://docs.google.com/spreadsheets/d/1NIvUmtqgWn6u1JSw0LnV7d-o8Y0zDv14gJsn_V5Too8/edit?usp=sharing">Click to check the rewards per trait</a>
            {/* <div className="w-[400px] h-[400px] bg-gradient-to-br from-orange-500 to-yellow-400 blur-[200px] absolute z-[-1] top-[-80px] left-[-230px]"></div>
            <div className="w-[500px] h-[400px] bg-gradient-to-br from-orange-600 to-red-400 blur-[250px] absolute z-[-1] top-[-30px] right-[-130px]"></div>
            <div className="w-[600px] h-[600px] bg-gradient-to-br from-yellow-300 to-red-400 blur-[250px] absolute z-[-1] bottom-[-100px] right-[-10px]"></div> */}


            <button disabled={loadingBurning} onClick={()=>{approval()}} className={`mt-5 block text-lg ${loadingBurning && "animate-pulse"} bg-gradient-to-br rounded-2xl border-2 hover:bg-gradient-to-b duration-300 border-white from-red-500 to-orange-400 font-bold px-5 py-3`}>{loadingBurning ? "Burning..." : "Burn Selected"}</button>

            <div className="w-[95%] sm:h-[58vh] min-[1600px]:h-[63vh] h-[30rem] mx-auto overflow-y-scroll sm:mt-12 mt-10 no-scrollbar bg-white/30 p-5 rounded-2xl">
                <h1 className="text-xl mb-5 font-bold ml-3">Your NFTs:</h1>
                { loadingNFTs && 
                <div className="flex flex-col h-[80%] items-center justify-center">
                     <InfinitySpin visible={true} width="200" color="#fc6100" ariaLabel="infinity-spin-loading" />
                     <h1 className="text-orange-500 animate-pulse font-bold">Fetching NFTs...</h1>
                     </div>
                        }
                <div className="flex flex-wrap gap-5 mx-auto justify-center">
                {displayNFT.map((item)=>(
                    <div className="relative">
                        <div className={`w-6 h-6 absolute z-10 top-2 right-2 ${selected.includes(item.tokenId) ? "bg-orange-600 shadow-lg shadow-orange-500": "bg-gray-500"} border-white border-[1px] rounded-md`} onClick={()=>{
                                        if(!selected.includes(item.tokenId)){
                                            setSelected(oldArray => [...oldArray, item.tokenId]);
                                            var reward = cumulativeReward;
                                            console.log(reward, item.reward);
                                            reward = reward+item.reward;
                                            setCumulativeReward(reward);
                                            console.log(reward);

                                        }
                                        else{
                                            const updatedArray = selected.filter((tokenId) => tokenId !== item.tokenId);
                                            setSelected(updatedArray);
                                            var reward = cumulativeReward;
                                            reward = reward-item.reward;
                                            setCumulativeReward(reward)
                                            console.log(reward);

                                        }
                                    }} >
                                        
                                    </div>
                        <NFTCards name={item.name} tokenId={item.tokenId} img={item.img} reward={item.reward}/>
                    </div>
                ))}
                </div>
                
            </div>
        </div>
    )
}