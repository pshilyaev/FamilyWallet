import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {toEtherFormat} from "../utils/contact";

function Child({contract, onError, onBalanceChanged}) {
    const [daily, setDaily] = useState(null);
    const [available, setAvailable] = useState(null);
    const [inputValue, setInputValue] = useState({amount: "", address: ""});

    const getWithdrawAmount = async () => {
        console.log('1',await contract.getWithdrawAmount());
        const amount = await contract.getWithdrawAmount();
        console.log("Withdraw Amount: " + amount);
        setAvailable(toEtherFormat(amount));
    }

    useEffect(async () => {
        await getWithdrawAmount();
        setDaily(toEtherFormat(await contract.dayLimit()));
    }, []);

    const handleInputChange = (event) => {
        setInputValue(prevFormData => ({...prevFormData, [event.target.name]: event.target.value}));
    }

    const setWithdrawHandler = async (event) => {
        try {
            event.preventDefault();
            if (window.ethereum) {
                const txn = await contract.withdrawMoney(inputValue.address, ethers.utils.parseEther(inputValue.amount));
                setInputValue({...inputValue, amount: "", address: ""});
                console.log("Withdraw in progress...");
                await txn.wait();
                console.log("Withdraw... done", txn.hash);
                await getWithdrawAmount();
                await onBalanceChanged();
            } else {
                console.log("Ethereum object not found, install Metamask.");
            }
        } catch (error) {
            console.log(error.reason);
            onError(error.reason);
        }
    }

    return (
        <div className="mt-10 mb-10">
            <form className="form-style">
                <h3 className="form-title">
                    You are child: you can spend money
                    <br/>
                    Daily amount: {daily}
                    <br/>
                    Available amount: {available}
                </h3>
                <input
                    type="text"
                    className="input-style"
                    onChange={handleInputChange}
                    name="amount"
                    placeholder="Amount to withdraw"
                    value={inputValue.amount}
                />
                <input
                    type="text"
                    className="input-style"
                    onChange={handleInputChange}
                    name="address"
                    placeholder="To address"
                    value={inputValue.address}
                />
                <button
                    className="btn-purple"
                    onClick={setWithdrawHandler}>
                    Withdraw
                </button>
            </form>
        </div>
    );
}

export default Child;
