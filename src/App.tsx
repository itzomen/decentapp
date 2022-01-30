import "./App.css";
import { ethers } from "ethers";
import { useState } from "react";
import TokenArtifact from "./artifacts/contracts/Token.sol/Token.json";
const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

function App() {
  const [tokenData, setTokenData] = useState({ name: "", symbol: "" });
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [userAccountId, setUserAccountId] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  async function _intializeContract(init: any) {
    // We first initialize ethers by creating a provider using window.ethereum
    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    const contract = new ethers.Contract(tokenAddress, TokenArtifact.abi, init);

    return contract;
  }
  async function _getTokenData() {
    const contract = await _intializeContract(signer);
    const name = await contract.name();
    const symbol = await contract.symbol();
    const tokenData = { name, symbol };
    setTokenData(tokenData);
  }
  async function sendBRToken() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const contract = await _intializeContract(signer);
      const transaction = await contract.transfer(userAccountId, amount);
      await transaction.wait();
      // console.log(`${amount} BRToken has been sent to ${userAccountId}`);
      getBalance();
      alert(`${amount} BRToken has been sent to ${userAccountId}`);
    }
  }
  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const contract = await _intializeContract(signer);
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const balance = await contract.balanceOf(account);
      // console.log("Account Balance: ", balance.toString());
      setBalance(balance.toString());
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>{tokenData.name}</h1>
        <button onClick={_getTokenData}>get token data</button>
        <h2>{balance + " " + tokenData.symbol}</h2>
        <button onClick={getBalance}>Get My Balance</button>
        <input
          onChange={(e) => setUserAccountId(e.target.value)}
          placeholder="Account ID"
        />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <button onClick={sendBRToken}>Send Brigde Token</button>
      </header>
    </div>
  );
}
export default App;
