import { ThirdwebAuth } from "@thirdweb-dev/auth/next/solana";

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  privateKey: process.env.PRIVATE_KEY!,
  domain: process.env.NEXT_PUBLIC_DOMAIN || "localhost:3000",
});
