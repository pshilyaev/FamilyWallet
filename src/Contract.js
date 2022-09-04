import {useEffect, useState} from 'react';
import Owner from "./components/Owner";
import Parent from "./components/Parent";
import Child from "./components/Child";
import {useParams} from "react-router-dom";
import {getBalance, getContract} from "./utils/contact";

function Contract({address, onError}) {
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState(null);
    const [parents, setParents] = useState([]);
    const [children, setChildren] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [isParent, setIsParent] = useState(false);
    const [isChild, setIsChild] = useState(false);

    const { id } = useParams();

    useEffect(async () => {
        setContract(getContract(id));
        setBalance(await getBalance(id))
    }, [])

    const updateMembers = async () => {
        if (contract) {
            setParents((await contract.getParents()).map((addr) => addr.toLowerCase()));
            setChildren((await contract.getChildren()).map((addr) => addr.toLowerCase()));
        }
    }

    useEffect(async () => {
        if (contract) {
            await updateMembers();
            const owner = await contract.walletOwner();

            setIsOwner(owner.toLowerCase() === address);
        }
    }, [address, contract]);

    useEffect(() => {
        setIsParent(parents.indexOf(address) > -1);
    }, [parents]);

    useEffect(() => {
        setIsChild(children.indexOf(address) > -1);
    }, [children]);

    const onBalanceChanged = async () => {
        setBalance(await getBalance(id))
    };

    return (
        <>
            <section className="customer-section p-5 text-sky-700">
                <p><span className="font-bold">Wallet: {id}</span></p>
                <p><span className="font-bold">Balance: {balance}</span></p>
                <p><span className="font-bold">Parents:</span></p>
                {parents.map((parent) => (
                    <p key={parent}>{parent}</p>
                ))}
                <p><span className="font-bold">Children:</span></p>
                {children.map((child) => (
                    <p key={child}>{child}</p>
                ))}
                {isOwner && (<Owner contract={contract} onUpdate={updateMembers} onError={onError} />)}
                {isParent && (<Parent contract={contract} onError={onError} onBalanceChanged={onBalanceChanged} />)}
                {isChild && (<Child contract={contract} onError={onError} onBalanceChanged={onBalanceChanged} />)}
            </section>
        </>
    );
}

export default Contract;
