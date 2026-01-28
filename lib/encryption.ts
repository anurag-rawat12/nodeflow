
import Cryptr from 'cryptr';

const secret = process.env.ENCRYPTION_KEY;

if (!secret) {
    throw new Error("ENCRYPTION_KEY is missing in environment variables");
}

const cryptr = new Cryptr(secret);

export const encrypt =
    (text: string) => cryptr.encrypt(text);

export const decrypt =
    (encrypted: string) => cryptr.decrypt(encrypted);