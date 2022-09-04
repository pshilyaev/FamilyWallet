import {useState} from "react";
import {ethers} from "ethers";

function Parent({contract, onError, onBalanceChanged}) {
    const [inputValue, setInputValue] = useState({amount: ""});

    const handleInputChange = (event) => {
        setInputValue(prevFormData => ({...prevFormData, [event.target.name]: event.target.value}));
    }

    const setDepositHandler = async (event) => {
        try {
            event.preventDefault();
            if (window.ethereum) {
                const txn = await contract.addMoney({ value: ethers.utils.parseEther(inputValue.amount) });
                setInputValue({...inputValue, amount: ""});
                console.log("Deposit in progress...");
                await txn.wait();
                console.log("Deposit... done", txn.hash);
                await onBalanceChanged();
            } else {
                console.log("Ethereum object not found, install Metamask.");
            }
        } catch (error) {
            console.log(error)
            onError(error.reason);
        }
    }

    return (
        <div className="mt-10 mb-10">
            <form className="form-style">
                <h3 className="form-title">You are parent: you can deposit money</h3>
                <input
                    type="text"
                    className="input-style"
                    onChange={handleInputChange}
                    name="amount"
                    placeholder="Amount to deposit (in ETH)"
                    value={inputValue.amount}
                />
                <button
                    className="btn-purple"
                    onClick={setDepositHandler}>
                    Deposit
                </button>
            </form>
        </div>
    );
}

export default Parent;
