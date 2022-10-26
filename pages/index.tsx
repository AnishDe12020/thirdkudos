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
  HStack,
  Box,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "@thirdweb-dev/react/solana";
import axios from "axios";
import { elementToSVG, inlineResources } from "dom-to-svg";
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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MintFormValues>();

  const handleMintKudos: SubmitHandler<MintFormValues> = async values => {
    if (!publicKey) {
      console.error("No wallet connected");
      return;
    }

    console.log("values", values);

    const svgDoc = elementToSVG(document.querySelector("#kudo") as Element);

    await inlineResources(svgDoc.documentElement);

    const svgString = new XMLSerializer().serializeToString(svgDoc);

    const svgUri = `data:image/svg+xml,${encodeURIComponent(svgString)}`;

    const res = await axios.post("/api/mint", {
      svgString: svgUri,
      title: values.title,
      description: values.description,
      mintTo: values.receiverWalletAddress,
      senderAddress: publicKey.toBase58(),
    });

    console.log(res);
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
          <VStack flexDir="column-reverse" gap={16} mt={16}>
            <VStack
              onSubmit={handleSubmit(handleMintKudos)}
              as="form"
              gap={8}
              w="full"
            >
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
                    validate: v => {
                      try {
                        new PublicKey(v);
                        return true;
                      } catch {
                        return "Invalid Wallet Address";
                      }
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.receiverWalletAddress &&
                    errors.receiverWalletAddress.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                colorScheme="green"
                isLoading={isSubmitting}
                type="submit"
              >
                Send Kudo
              </Button>
            </VStack>
            <VStack
              id="kudo"
              justifyContent="space-between"
              alignItems="flex-start"
              background="black"
              h="512px"
              w="512px"
              px={8}
              py={4}
            >
              <VStack alignItems="flex-start">
                <Text fontSize="4xl" fontWeight="bold" textColor="white">
                  {watch("title") || "Title goes here"}
                </Text>
                <Text fontSize="lg" fontWeight="normal" textColor="gray.400">
                  {watch("description") || "Description goes here"}
                </Text>
              </VStack>
              <Text fontSize="wsmg" fontWeight="semibold" textColor="gray.400">
                Made with{" "}
                <chakra.span textColor="green.400">
                  thirdkudos.vercel.app
                </chakra.span>
              </Text>
            </VStack>
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
