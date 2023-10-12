import { Eip1193Provider } from "ethers";

import "../../smart_contract/typechain-types/index";

declare global {
  interface Window {
    ethereum: Eip1193Provider;
  }
}
