import { ChakraProvider } from "@chakra-ui/react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
import { Network } from "@thirdweb-dev/sdk/solana";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import "../styles/globals.css";
// import "../styles/WalletAdapterStyles.css";
import theme from "../theme";

require("@solana/wallet-adapter-react-ui/styles.css");

// Change the network to the one you want to use: "mainnet-beta", "testnet", "devnet", "localhost" or your own RPC endpoint
const network: Network = "devnet";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      network={network}
      authConfig={{
        authUrl: "/api/auth",
        domain: process.env.NEXT_PUBLIC_DOMAIN || "localhost:3000",
        loginRedirect: "/",
      }}
    >
      <WalletModalProvider>
        <ChakraProvider theme={theme}>
          <Header />
          <Component {...pageProps} />
        </ChakraProvider>
      </WalletModalProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
