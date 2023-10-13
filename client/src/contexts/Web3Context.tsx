import { BrowserProvider, Signer } from "ethers";
import { createContext } from "react";

const Web3Context = createContext<{
  provider?: BrowserProvider;
  signer?: Signer;
  signerAddress?: string;
  connectSigner: (account?: string) => Promise<void>;
}>({ connectSigner: async () => {} });

export default Web3Context;
