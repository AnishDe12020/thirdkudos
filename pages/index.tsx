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
  VStack,
  useColorModeValue,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  HStack,
  Link,
  StatUpArrow,
  Icon,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { useLogin, useUser } from "@thirdweb-dev/react/solana";
import axios from "axios";
import { elementToSVG, inlineResources } from "dom-to-svg";
import type { NextPage } from "next";
import { MouseEventHandler, useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ExternalLink } from "react-feather";

type MintFormValues = {
  title: string;
  description?: string;
  receiverWalletAddress: string;
};

const Home: NextPage = () => {
  const modalState = useWalletModal();
  const { wallet, connect, connected, publicKey } = useWallet();
  const login = useLogin();
  const { user } = useUser();
  const toast = useToast();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const [svgUri, setSvgUri] = useState<string | null>(null);
  const [mintedAddress, setMintedAddress] = useState<string | null>(null);

  const buttonBg = useColorModeValue("green.400", "green.600");
  const buttonHoverBg = useColorModeValue("green.500", "green.700");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MintFormValues>();

  const handleMintKudos: SubmitHandler<MintFormValues> = async values => {
    if (!user?.address) {
      console.error("No user signed in");
      return;
    }

    const svgDoc = elementToSVG(document.querySelector("#kudo") as Element);

    await inlineResources(svgDoc.documentElement);

    const svgString = new XMLSerializer().serializeToString(svgDoc);

    const svgUri = `data:image/svg+xml,${encodeURIComponent(svgString)}`;

    setSvgUri(svgUri);

    try {
      const res = await axios.post("/api/mint", {
        svgString: svgUri,
        title: values.title,
        description: values.description,
        mintTo: values.receiverWalletAddress,
        senderAddress: user.address,
      });

      setMintedAddress(res.data.address);
      onOpen();
    } catch (e) {
      console.error(e);
      toast({
        title: "Failed to mint Kudo",
        description:
          "Something went wrong when minting the kudo, check the console for more information. Please try again later",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
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
      <Heading as="h1" mb={16}>
        Thirdkudos
      </Heading>
      {connected ? (
        user ? (
          <>
            <VStack flexDir="column-reverse" gap={16}>
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
                  backgroundColor={buttonBg}
                  _hover={{ backgroundColor: buttonHoverBg }}
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
                <Text
                  fontSize="wsmg"
                  fontWeight="semibold"
                  textColor="gray.400"
                >
                  Made with{" "}
                  <chakra.span textColor="green.400">
                    thirdkudos.vercel.app
                  </chakra.span>
                </Text>
              </VStack>
            </VStack>
          </>
        ) : (
          <Button
            onClick={() => login()}
            backgroundColor="green.600"
            _hover={{ backgroundColor: "green.700" }}
          >
            Sign in with Solana
          </Button>
        )
      ) : (
        <Button
          onClick={handleConnectClick}
          backgroundColor="green.600"
          _hover={{ backgroundColor: "green.700" }}
        >
          Connect Wallet
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent bg="brand.secondary">
          <ModalHeader>Kudo Minted Successfully</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack gap={8} mb={8}>
              {svgUri && (
                <Image src={svgUri} alt="Minted Kudo" h="256px" w="256px" />
              )}
              <VStack alignItems="flex-start" gap={16}>
                <VStack alignItems="flex-start" gap={4}>
                  <Text>Mint Address: {mintedAddress}</Text>
                  <Text>Receiver: {watch("receiverWalletAddress")}</Text>
                </VStack>

                <VStack alignItems="flex-start" gap={4}>
                  <Link
                    href={`https://explorer.solana.com/address/${mintedAddress}?cluster=devnet`}
                    isExternal
                  >
                    See on Solana Explorer <Icon as={ExternalLink} mx="2px" />
                  </Link>
                  <Link
                    href={`https://solscan.io/token/${mintedAddress}?cluster=devnet`}
                    isExternal
                  >
                    See on Solscan <Icon as={ExternalLink} mx="2px" />
                  </Link>
                </VStack>
              </VStack>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Home;
