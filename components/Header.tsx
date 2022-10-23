import { Box, Flex } from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = (): JSX.Element => {
  return (
    <Flex
      as="nav"
      flexDir="row"
      justifyContent="flex-end"
      w="100vw"
      px={8}
      py={4}
    >
      <WalletMultiButton />
    </Flex>
  );
};

export default Header;
