import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (!process.env.PRIVATE_KEY) {
      throw Error("No private key in environment");
    }

    if (!process.env.NEXT_PUBLIC_NFT_COLLECTION) {
      throw Error("No NFT collection address in environment");
    }

    const body = req.body;

    if (!body.mintTo) {
      throw Error("No address provided");
    }

    if (!body.svgString) {
      throw Error("No SVG string provided");
    }

    if (!body.title) {
      throw Error("No title provided");
    }

    if (!body.senderAddress) {
      throw Error("No sender address provided");
    }

    try {
      const sdk = ThirdwebSDK.fromPrivateKey(
        "https://api.devnet.solana.com",
        process.env.PRIVATE_KEY
      );

      const program = await sdk.getProgram(
        process.env.NEXT_PUBLIC_NFT_COLLECTION,
        "nft-collection"
      );

      const metadata = {
        name: body.title,
        description: body.description,
        image: body.svgString,

        attributes: [
          {
            name: "Title",
            value: body.title,
          },
          {
            name: "Description",
            value: body.description,
          },
          {
            name: "Sender",
            value: body.senderAddress,
          },
        ],
      };

      const address = await program.mintTo(body.mintTo, metadata);

      res.status(200).json({ status: "success", address });
    } catch (e) {
      console.error(e);
      res.status(500).json({ status: "error", error: e });
    }
  } else {
    res.status(405).json({ status: "error", error: "Method not allowed" });
  }
};

export default handler;
