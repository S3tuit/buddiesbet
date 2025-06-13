// LIGHTWEIGHT SIMMETRIC PASSWORD ENCRYPTION
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

// only test for at least one lower- and one upper-case letter
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).*$/;

const SECRET = process.env.CRYPTO_KEY_SECRET!;
if (SECRET.length < 32) {
  throw new Error("CRYPTO_KEY_SECRET is not present!");
}
const key = Buffer.from(SECRET.slice(0, 32), "utf8");

// 1) Encrypt function: returns iv:tag:ciphertext (all hex-encoded)
export function encrypt(text: string): string {
  const iv = randomBytes(12); // 96-bit IV for GCM
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  // join as hex parts
  return `${iv.toString("hex")}:${tag.toString("hex")}:${ciphertext.toString(
    "hex"
  )}`;
}

// 2) Decrypt function: splits the three parts and recovers the plaintext
export function decrypt(payload: string): string {
  const [ivHex, tagHex, ctHex] = payload.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const ciphertext = Buffer.from(ctHex, "hex");

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}
