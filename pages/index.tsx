import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  chakra,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useProgram } from "@thirdweb-dev/react/solana";
import axios from "axios";
import type { NextPage } from "next";
import { MouseEventHandler, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type MintFormValues = {
  title: string;
  description?: string;
  receiverWalletAddress: string;
};

const Home: NextPage = () => {
  const modalState = useWalletModal();
  const { wallet, connect, connected, publicKey } = useWallet();

  const { program } = useProgram(
    "34depVJpfehqGGBEAC9G4TSnKxogQxoFP6dNUE3Q6KBq",
    "nft-collection"
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MintFormValues>();

  // const mintTestNFT = async () => {
  //   const address = await program.mint({
  //     name: "NFT 1",
  //     description: "This is a test NFT",
  //     image:
  //       "https://res.cloudinary.com/anishde12020/image/upload/v1654360780/Blogfolio/og.png",

  //     properties: [
  //       {
  //         name: "Property 1",
  //         value: "Value 1",
  //       },
  //     ],
  //     attributes: [
  //       {
  //         name: "Attribute 1",
  //         value: "Value 1",
  //       },
  //     ],
  //   });

  //   console.log(address);
  // };

  const handleMintKudos: SubmitHandler<MintFormValues> = async values => {
    if (!publicKey) {
      console.error("No wallet connected");
      return;
    }

    console.log("values", values);

    // const res = await axios.get(`/api/mint?mintTo=${publicKey.toString()}`);

    // console.log(res);
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
          <VStack onSubmit={handleSubmit(handleMintKudos)} as="form" gap={8}>
            <FormControl isInvalid={errors.title ? true : false}>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                id="title"
                placeholder="Title"
                {...register("title", {
                  required: "Title is required",
                })}
              />
              <FormErrorMessage>
                {errors.title && errors.title.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Input
                as={Textarea}
                id="description"
                placeholder="Description"
                {...register("description")}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.receiverWalletAddress ? true : false}
            >
              <FormLabel htmlFor="receiverWalletAddress">
                Receiver&apos;s Wallet Address
              </FormLabel>
              <Input
                id="receiverWalletAddress"
                placeholder="Receiver's Wallet Address"
                {...register("receiverWalletAddress", {
                  required: "Wallet Address is required",
                })}
              />
              <FormErrorMessage>
                {errors.receiverWalletAddress &&
                  errors.receiverWalletAddress.message}
              </FormErrorMessage>
            </FormControl>
            <Button colorScheme="green" isLoading={isSubmitting} type="submit">
              Send Kudo
            </Button>
          </VStack>
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
