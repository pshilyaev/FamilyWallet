import { useState, useEffect } from 'react';
import AddWallet from "./AddWallet";
import {getContract} from "./utils/contact";
import Contract from "./Contract";
import {Route, Routes, useNavigate} from "react-router-dom";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setCustomerAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to use our wallet.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [isWalletConnected])

  useEffect(() => {
    if (walletAddress) {
      setContract(getContract(walletAddress));
    }
  }, [walletAddress])

  const onErrorHandler = (err) => {
    setError(err);
  }

  const onWalletCreated = (address) => {
    setWalletAddress(address);
    navigate(`/wallet/${address}`, { replace: true });
  }

  return (
    <main className="main-container">
      <div className="headline">
        <h2 className="flex-1"><span className="headline-gradient">Family Wallet</span></h2>
        <button className="btn-connect" onClick={checkIfWalletIsConnected}>
          {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
        </button>
      </div>
      <section className="customer-section px-10 pt-5 pb-10 text-sky-700">
        {error && <p className="text-2xl text-red-700 mb-5">{error}</p>}
        {isWalletConnected && <p><span className="font-bold">Your Address: </span>{customerAddress}</p>}
        {walletAddress && <p><span className="font-bold">Wallet Address: </span>{walletAddress}</p>}
      </section>

      {isWalletConnected && (
          <Routes>
            <Route path="/" element={<AddWallet callback={onWalletCreated} />} />
            <Route path="/wallet/:id" element={<Contract address={customerAddress} onError={onErrorHandler} />} />
          </Routes>
      )}
    </main>
  );
}
export default App;
