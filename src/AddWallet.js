import { useState } from 'react';
import { ContractFactory, utils } from "ethers";
import abi from "./contracts/FamilyWallet.json";
import {getSigner} from "./utils/contact";
import {useNavigate} from "react-router-dom";

function AddWallet({callback}) {
    const [inputValue, setInputValue] = useState({ name: "", limit: "", address: "" });
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setInputValue(prevFormData => ({...prevFormData, [event.target.name]: event.target.value}));
    }

    const createContractHandler = async (event) => {
        try {
            event.preventDefault();
            if (window.ethereum) {
                //write data

                const signer = await getSigner();
                const factory = new ContractFactory(abi.abi, abi.bytecode, signer);

                const contract = await factory.deploy(inputValue.name, utils.parseEther(inputValue.limit));

                console.log(contract.address);
                console.log(contract.deployTransaction);

                callback(contract.address);
            } else {
                console.log("Ethereum object not found, install Metamask.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const setContractHandler = async (event) => {
        try {
            event.preventDefault();
            callback(inputValue.address);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="customer-section p-5">
            <div className="mb-10">
                <form className="form-style">
                    <h3 className="form-title">Create new wallet</h3>
                    <input
                        type="text"
                        className="input-style"
                        onChange={handleInputChange}
                        name="name"
                        placeholder="Wallet name"
                        value={inputValue.name}
                    />
                    <input
                        type="text"
                        className="input-style"
                        onChange={handleInputChange}
                        name="limit"
                        placeholder="Daily limit (ETH)"
                        value={inputValue.limit}
                    />
                    <button
                        className="btn-purple"
                        onClick={createContractHandler}>
                        Create Family Wallet
                    </button>
                </form>
            </div>
            <div className="">
                <form className="form-style">
                    <h3 className="form-title">Enter wallet address</h3>
                    <input
                        type="text"
                        className="input-style"
                        onChange={handleInputChange}
                        name="address"
                        placeholder="Wallet address"
                        value={inputValue.address}
                    />
                    <button
                        className="btn-purple"
                        onClick={setContractHandler}>
                        Use Family Wallet At Address
                    </button>
                </form>
            </div>
        </section>
    );
}

export default AddWallet;
