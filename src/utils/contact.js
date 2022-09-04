import { ethers } from "ethers";
import abi from "../contracts/FamilyWallet.json";

export const getAddress = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    return accounts[0];
}

export const getSigner = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getSigner();
}

export const getContract = (contractAddress) => {
    const signer = getSigner();
    return new ethers.Contract(contractAddress, abi.abi, signer);
}

export const getBalance = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    return  ethers.utils.formatEther(balance);
}

export const toEtherFormat = (amount) => {
    return ethers.utils.formatEther(amount);
}
