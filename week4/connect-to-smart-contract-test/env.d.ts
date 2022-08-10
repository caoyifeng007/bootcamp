/// <reference types="vite/client" />

import { providers } from "ethers";

declare global {
  interface Window {
    ethereum: providers.ExternalProvider;
  }
}
