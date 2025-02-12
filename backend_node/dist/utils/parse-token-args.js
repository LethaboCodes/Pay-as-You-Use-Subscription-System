import dotenv from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";
dotenv.config({
    path: fileURLToPath(join(import.meta.url, "..", "..", ".env")),
});
var Flag;
(function (Flag) {
    Flag["TOKEN"] = "--token";
})(Flag || (Flag = {}));
var Token;
(function (Token) {
    Token["INCOMING"] = "ip";
    Token["OUTGOING"] = "op";
    Token["QUOTE"] = "quote";
})(Token || (Token = {}));
const map = new Map([
    [
        Token.INCOMING,
        {
            manageUrl: process.env.INCOMING_PAYMENT_ACCESS_TOKEN_MANAGE_URL,
            accessToken: process.env.INCOMING_PAYMENT_ACCESS_TOKEN,
        },
    ],
    [
        Token.OUTGOING,
        {
            manageUrl: process.env.OUTGOING_PAYMENT_ACCESS_TOKEN_MANAGE_URL,
            accessToken: process.env.OUTGOING_PAYMENT_ACCESS_TOKEN,
        },
    ],
    [
        Token.QUOTE,
        {
            manageUrl: process.env.QUOTE_ACCESS_TOKEN_MANAGE_URL,
            accessToken: process.env.QUOTE_ACCESS_TOKEN,
        },
    ],
]);
function isToken(t) {
    return Object.values(Token).includes(t);
}
export function parseTokenArgs(args) {
    let ACCESS_TOKEN = process.env.ACCESS_TOKEN;
    let MANAGE_URL = process.env.MANAGE_URL;
    let parsedFlags = [];
    while (args.length > 0) {
        const flag = args.shift();
        let value;
        switch (flag) {
            case Flag.TOKEN:
                if (parsedFlags.includes(flag)) {
                    throw new Error(`Received duplicate flag: "${flag}"`);
                }
                if (args.length === 0) {
                    throw new Error(`No value was provided for flag "${flag}".`);
                }
                value = args.shift();
                if (isToken(value)) {
                    const options = map.get(value);
                    if (!options) {
                        throw new Error(`Missing "manageUrl" and "accessToken" for "${value}"`);
                    }
                    ACCESS_TOKEN = options.accessToken;
                    MANAGE_URL = options.manageUrl;
                    parsedFlags.push(flag);
                }
                else {
                    throw new Error(`Invalid "${value}" value.`);
                }
                break;
            default:
                console.log("\x1b[31mIgnoring invalid flag:", flag, "\x1b[0m");
                if (args.length === 0) {
                    break;
                }
                if (!args[0].startsWith("--")) {
                    args.shift();
                }
                break;
        }
    }
    return {
        ACCESS_TOKEN,
        MANAGE_URL,
    };
}
