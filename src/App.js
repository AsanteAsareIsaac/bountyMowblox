import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [prices, setPrices] = useState({ btcUsd: null, ethUsd: null, linkUsd: null });
  const [web3, setWeb3] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    if (account && web3) {
      fetchEthBalance();
      fetchPrices();
      checkNetwork();
      const interval = setInterval(fetchPrices, 60000); // Update prices every minute
      return () => clearInterval(interval);
    }
  }, [account, web3]);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        await provider.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        await checkNetwork();
      } else {
        setError('MetaMask is not installed. Please install MetaMask to use this app.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setError('Failed to connect. Please try again and approve the connection in the MetaMask popup.');
    } finally {
      setIsConnecting(false);
    }
  };

  const checkNetwork = async () => {
    if (web3) {
      const networkId = await web3.eth.net.getId();
      setNetwork(networkId === 11155111 ? 'Sepolia' : 'Unknown');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setEthBalance(null);
    setPrices({ btcUsd: null, ethUsd: null, linkUsd: null });
    setError(null);
    setNetwork(null);
  };

  const fetchEthBalance = async () => {
    try {
      const balance = await web3.eth.getBalance(account);
      const balanceInEth = web3.utils.fromWei(balance, 'ether');
      console.log('Fetched ETH balance:', balanceInEth);
      setEthBalance(parseFloat(balanceInEth).toFixed(4)); // Limit to 4 decimal places
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      setError('Failed to fetch ETH balance. Please try again.');
    }
  };

  const fetchPrices = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,chainlink&vs_currencies=usd');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      setPrices({
        btcUsd: data.bitcoin.usd.toFixed(2),
        ethUsd: data.ethereum.usd.toFixed(2),
        linkUsd: data.chainlink.usd.toFixed(2)
      });
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching prices:', error);
      setError('Failed to fetch cryptocurrency prices. Please try again.');
    }
  };

  const calculatePortfolioValue = () => {
    if (ethBalance !== null && prices.ethUsd) {
      const value = parseFloat(ethBalance) * parseFloat(prices.ethUsd);
      return value.toFixed(2);
    }
    return 'Calculating...';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crypto Portfolio Tracker (Sepolia Testnet)</h1>
        {error && <p className="error">{error}</p>}
        {!account ? (
          <div>
            <p>Connect your MetaMask wallet to view your Sepolia testnet portfolio.</p>
            <button onClick={connectWallet} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connect MetaMask Wallet'}
            </button>
          </div>
        ) : (
          <div>
            <div className="wallet-info">
              <p>Connected Account: {account}</p>
              <p>Network: {network}</p>
              <p>Sepolia ETH Balance: {ethBalance !== null ? `${ethBalance} SepoliaETH` : 'Loading...'}</p>
            </div>
            <h2>Cryptocurrency Prices (Mainnet)</h2>
            <div className="price-container">
              <div className="price-item">
                <p>BTC/USD</p>
                <p>${prices.btcUsd || 'Loading...'}</p>
              </div>
              <div className="price-item">
                <p>ETH/USD</p>
                <p>${prices.ethUsd || 'Loading...'}</p>
              </div>
              <div className="price-item">
                <p>LINK/USD</p>
                <p>${prices.linkUsd || 'Loading...'}</p>
              </div>
            </div>
            <p className="last-updated">Last Updated: {lastUpdated || 'Not yet updated'}</p>
            <h2>Simulated Portfolio Value</h2>
            <p className="portfolio-value">${calculatePortfolioValue()} USD</p>
            <p className="note">Note: This is a simulation using Sepolia testnet ETH and mainnet prices.</p>
            <button onClick={disconnectWallet}>Disconnect</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;