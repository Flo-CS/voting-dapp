import { useCallback, useEffect, useMemo, useState } from "react";
import Web3Context from "../contexts/Web3Context";
import { BrowserProvider, Signer, ethers } from "ethers";

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [provider, setProvider] = useState<BrowserProvider | undefined>();
  const [signer, setSigner] = useState<Signer | undefined>();
  const [signerAddress, setSignerAddress] = useState<string | undefined>();

  const connectSigner = useCallback(
    async (account?: string) => {
      try {
        const signer = await provider?.getSigner(account);
        setSigner(signer);
        const signerAddress = await signer?.getAddress();
        setSignerAddress(signerAddress);
      } catch (error) {
        console.error("Could not connect signer");
      }
    },
    [provider]
  );

  const updateProvider = () => {
    if (window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  };

  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      if (accounts.length === 0) {
        setSigner(undefined);
        setSignerAddress(undefined);
      } else {
        connectSigner(accounts[0]);
      }
    },
    [connectSigner]
  );

  useEffect(() => {
    updateProvider();
  }, []);

  useEffect(() => {
    // Ethersjs does not support the "accountsChanged" event
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [handleAccountsChanged]);

  const contextValue = useMemo(
    () => ({ signer, provider, connectSigner, signerAddress }),
    [signer, provider, connectSigner, signerAddress]
  );

  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
}
