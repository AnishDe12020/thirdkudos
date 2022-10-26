import {
  Flex,
  HStack,
  IconButton,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Moon, Sun } from "react-feather";

const Header = (): JSX.Element => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <HStack
      as="nav"
      justifyContent="flex-end"
      alignItems="center"
      w="100vw"
      px={8}
      py={4}
      gap={4}
    >
      <Tooltip
        label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
      >
        <IconButton
          aria-label={`Switch to ${
            colorMode === "light" ? "dark" : "light"
          } mode`}
          onClick={toggleColorMode}
          icon={colorMode === "light" ? <Moon /> : <Sun />}
        />
      </Tooltip>
      <WalletMultiButton />
    </HStack>
  );
};

export default Header;
