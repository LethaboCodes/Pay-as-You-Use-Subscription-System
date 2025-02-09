import dotenv from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";
dotenv.config({
    path: fileURLToPath(join(import.meta.url, "..", "..", ".env")),
});
const KEY_ID = process.env.KEY_ID;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const INCOMING_PAYMENT_ACCESS_TOKEN = process.env.INCOMING_PAYMENT_ACCESS_TOKEN;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
import { createAuthenticatedClient } from "@interledger/open-payments";
const client = await createAuthenticatedClient({
    walletAddressUrl: WALLET_ADDRESS,
    privateKey: PRIVATE_KEY_PATH,
    keyId: KEY_ID,
});
const incomingPayment = await client.incomingPayment.create({
    url: new URL(WALLET_ADDRESS).origin,
    accessToken: INCOMING_PAYMENT_ACCESS_TOKEN,
}, {
    walletAddress: WALLET_ADDRESS,
    incomingAmount: {
        value: "1000",
        assetCode: "USD",
        assetScale: 2,
    },
    expiresAt: new Date(Date.now() + 60_000 * 10).toISOString(),
});
console.log("INCOMING PAYMENT URL =", incomingPayment.id);
