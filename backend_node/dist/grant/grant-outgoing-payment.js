import dotenv from "dotenv";
import { join } from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
dotenv.config({
    path: fileURLToPath(join(import.meta.url, "..", "..", ".env")),
});
const KEY_ID = process.env.KEY_ID;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const QUOTE_URL = process.env.QUOTE_URL;
const QUOTE_ACCESS_TOKEN = process.env.QUOTE_ACCESS_TOKEN;
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const NONCE = randomUUID();
import { createAuthenticatedClient, isPendingGrant } from "@interledger/open-payments";
const client = await createAuthenticatedClient({
    walletAddressUrl: WALLET_ADDRESS,
    privateKey: PRIVATE_KEY_PATH,
    keyId: KEY_ID,
});
const walletAddress = await client.walletAddress.get({
    url: WALLET_ADDRESS,
});
const quote = await client.quote.get({
    url: QUOTE_URL,
    accessToken: QUOTE_ACCESS_TOKEN,
});
const grant = await client.grant.request({
    url: walletAddress.authServer,
}, {
    access_token: {
        access: [
            {
                identifier: walletAddress.id,
                type: "outgoing-payment",
                actions: ["list", "list-all", "read", "read-all", "create"],
                limits: {
                    debitAmount: {
                        assetCode: quote.debitAmount.assetCode,
                        assetScale: quote.debitAmount.assetScale,
                        value: quote.debitAmount.value
                    }
                },
            },
        ],
    },
    interact: {
        start: ["redirect"],
        finish: {
            method: "redirect",
            uri: "http://localhost:3344",
            nonce: NONCE,
        },
    },
});
if (!isPendingGrant(grant)) {
    throw new Error("Expected interactive grant");
}
console.log("Please interact at the following URL:", grant.interact.redirect);
console.log("CONTINUE_ACCESS_TOKEN =", grant.continue.access_token.value);
console.log("CONTINUE_URI =", grant.continue.uri);
