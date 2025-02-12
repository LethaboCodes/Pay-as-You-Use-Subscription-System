import dotenv from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";
import { createAuthenticatedClient } from "@interledger/open-payments";
import { readFileSync } from "fs";

dotenv.config({
    path: fileURLToPath(join(import.meta.url, "..", "..", ".env")),
});

// Read the private key from the key file
const PRIVATE_KEY = readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');
console.log("Private Key Content:", PRIVATE_KEY); // Ensure it's correctly loaded

const KEY_ID = process.env.KEY_ID;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

const client = await createAuthenticatedClient({
    walletAddressUrl: WALLET_ADDRESS,
    privateKey: PRIVATE_KEY, // Use the key content
    keyId: KEY_ID,
});

const walletAddress = await client.walletAddress.get({
    url: WALLET_ADDRESS,
});

console.log("WALLET ADDRESS:", walletAddress);
