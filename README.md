# Crypto Portfolio Tracker (Sepolia Testnet)

## Description

This React-based web application allows users to track their cryptocurrency portfolio on the Sepolia testnet. It connects to MetaMask, displays the user's Sepolia ETH balance, and shows current prices for BTC, ETH, and LINK from mainnet.

## Features

- MetaMask wallet integration
- Sepolia testnet ETH balance display
- Real-time cryptocurrency price fetching (BTC, ETH, LINK)
- Simulated portfolio value calculation
- Automatic price updates every minute
- Network detection (Sepolia)

## Technologies Used

- React
- Web3.js
- MetaMask
- @metamask/detect-provider
- CoinGecko API

## Prerequisites

- Node.js and npm installed
- MetaMask browser extension
- Sepolia testnet ETH in your MetaMask wallet

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/crypto-portfolio-tracker.git
   ```
2. Navigate to the project directory:
   ```
   cd crypto-portfolio-tracker
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and go to `http://localhost:3000`
3. Ensure MetaMask is connected to the Sepolia testnet
4. Click "Connect MetaMask Wallet" in the app
5. View your Sepolia ETH balance and current cryptocurrency prices
6. The portfolio value is simulated based on your Sepolia ETH balance and mainnet prices

## Development

To modify the app:

1. Open `src/App.js` to edit the main component
2. Modify `src/App.css` for styling changes
3. Run `npm start` to see your changes in real-time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Disclaimer

This application uses Sepolia testnet ETH for balance display and mainnet prices for value calculation. It is intended for demonstration purposes only and should not be used for real financial decisions.