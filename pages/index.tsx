import { Button, Container, Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useWalletModal,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import type { NextPage } from "next";
import { MouseEventHandler, useCallback } from "react";

// Default styles that can be overridden by your app

const Home: NextPage = () => {
  // Here's how to get the thirdweb SDK instance
  // const sdk = useSDK();
  // Here's how to get a nft collection
  // const { program } = useProgram(
  //   your_nft_collection_address,
  //   "nft-collection"
  // );

  const modalState = useWalletModal();
  const { wallet, connect, connected } = useWallet();

  const handleConnectClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    e => {
      if (e.defaultPrevented) return;

      if (!wallet) {
        modalState.setVisible(true);
      } else {
        connect().catch(() => {});
      }
    },
    [wallet, connect, modalState]
  );

  return (
    <Container>
      <Heading>idk some app</Heading>
      {connected ? (
        <Text>Wallet connected, implement functionality</Text>
      ) : (
        <Button onClick={handleConnectClick} colorScheme="green">
          Connect Wallet
        </Button>
      )}
    </Container>
  );
};

export default Home;
