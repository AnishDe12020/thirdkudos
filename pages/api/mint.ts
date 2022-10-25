import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.PRIVATE_KEY) {
    console.error("No private key in environment");
    return;
  }

  if (!process.env.NEXT_PUBLIC_NFT_COLLECTION) {
    console.error("No NFT collection address in environment");
    return;
  }

  const mintTo = req.query.mintTo as string | undefined;

  if (!mintTo) {
    console.error("No address provided");
    return;
  }

  try {
    console.log("mint to", mintTo);
    console.log("collection address", process.env.NEXT_PUBLIC_NFT_COLLECTION);
    const sdk = ThirdwebSDK.fromPrivateKey(
      "https://api.devnet.solana.com",
      process.env.PRIVATE_KEY
    );

    const program = await sdk.getProgram(
      process.env.NEXT_PUBLIC_NFT_COLLECTION,
      "nft-collection"
    );

    const metadata = {
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
    };

    const address = await program.mintTo(mintTo, metadata);

    console.log(address);
    res.status(200).json({ status: "success", address });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", error: e });
  }
};

export default handler;
