import {utils} from "ethers";
import {useState} from "react";

function Owner({contract, onUpdate, onError}) {
    const [inputValue, setInputValue] = useState({parent: "", child: ""});

    const handleInputChange = (event) => {
        setInputValue(prevFormData => ({...prevFormData, [event.target.name]: event.target.value}));
    }

    const setParentHandler = async (event) => {
        try {
            event.preventDefault();
            if (window.ethereum) {
                //write data

                const txn = await contract.addParent(utils.getAddress(inputValue.parent));
                console.log("Adding parent...");
                await txn.wait();
                console.log("Parent was added...done", txn.hash);

                onUpdate();
            } else {
                console.log("Ethereum object not found, install Metamask.");
            }
        } catch (error) {
            console.log(error)
            onError(error.reason);
        }
    }

    const setChildHandler = async (event) => {
        try {
            event.preventDefault();
            if (window.ethereum) {
                //write data

                const txn = await contract.addChild(utils.getAddress(inputValue.child));
                console.log("Adding child...");
                await txn.wait();
                console.log("Child was added...done", txn.hash);

                onUpdate();
            } else {
                console.log("Ethereum object not found, install Metamask.");
            }
        } catch (error) {
            console.log(error)
            onError(error.reason);
        }
    }

    return (
        <>
            <div className="mt-10 mb-10">
                <form className="form-style">
                    <h3 className="form-title">Enter parent wallet address</h3>
                    <input
                        type="text"
                        className="input-style"
                        onChange={handleInputChange}
                        name="parent"
                        placeholder="Parent wallet address"
                        value={inputValue.parent}
                    />
                    <button
                        className="btn-purple"
                        onClick={setParentHandler}>
                        Add parent
                    </button>
                </form>
            </div>
            <div className="mb-10">
                <form className="form-style">
                    <h3 className="form-title">Enter child wallet address</h3>
                    <input
                        type="text"
                        className="input-style"
                        onChange={handleInputChange}
                        name="child"
                        placeholder="Child wallet address"
                        value={inputValue.child}
                    />
                    <button
                        className="btn-purple"
                        onClick={setChildHandler}>
                        Add child
                    </button>
                </form>
            </div>
        </>
    )
}

export default Owner;
