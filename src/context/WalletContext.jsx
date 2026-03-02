import React, { createContext, useContext, useState, useEffect } from "react";
import { peraWallet, reconnectSession } from "../utils/wallet";

const WalletContext = createContext(null);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Checks if you are already connected when the page reloads
    reconnectSession().then(accounts => {
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    });
  }, []);

  const connectWallet = async () => {
    try {
      const newAccounts = await peraWallet.connect();
      setAccount(newAccounts[0]);
    } catch (error) {
      if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
        console.error("Connection failed", error);
      }
    }
  };

  const disconnectWallet = async () => {
    await peraWallet.disconnect();
    setAccount(null);
  };

  return (
    <WalletContext.Provider value={{ account, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};