import { Button, Container, Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useProgram } from "@thirdweb-dev/react/solana";
import type { NextPage } from "next";
import { MouseEventHandler, useCallback } from "react";

// Default styles that can be overridden by your app

const Home: NextPage = () => {
  //

  const modalState = useWalletModal();
  const { wallet, connect, connected } = useWallet();

  const { program } = useProgram(
    "34depVJpfehqGGBEAC9G4TSnKxogQxoFP6dNUE3Q6KBq",
    "nft-collection"
  );

  const mintTestNFT = async () => {
    const address = await program.mint({
      name: "NFT 1",
      description: "This is a test NFT",
      image:
        "https://res.cloudinary.com/anishde12020/image/upload/v1654360780/Blogfolio/og.png",

      properties: [
        {
          name: "Property 1",
          value: "Value 1",
        },
      ],
      attributes: [
        {
          name: "Attribute 1",
          value: "Value 1",
        },
      ],
    });

    console.log(address);
  };

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
      <Heading as="h1">Thirdkudos</Heading>
      {connected ? (
        <>
          <Text>Wallet connected, implement functionality</Text>
          <Button onClick={mintTestNFT}>Mint test NFT</Button>
        </>
      ) : (
        <Button onClick={handleConnectClick} colorScheme="green">
          Connect Wallet
        </Button>
      )}
    </Container>
  );
};

export default Home;
