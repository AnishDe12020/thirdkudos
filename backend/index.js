import express from "express";
import cors from "cors";
import "dotenv/config";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(cookieParser());
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.post("/mint", async (req, res) => {
  try {
    if (!process.env.PRIVATE_KEY) {
      throw Error("No private key in environment");
    }

    if (!process.env.NFT_COLLECTION) {
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

    const sdk = ThirdwebSDK.fromPrivateKey(
      "https://api.devnet.solana.com",
      process.env.PRIVATE_KEY
    );

    if (body.senderAddress === body.mintTo) {
      throw Error("Cannot mint to self");
    }

    const program = await sdk.getProgram(
      process.env.NFT_COLLECTION,
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
});

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `Thirdkudos Backend listening on port ${process.env.PORT || 4000}!`
  );
});
