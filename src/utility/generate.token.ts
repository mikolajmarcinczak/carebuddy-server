import * as crypto from "crypto";

export const generateToken = (bytes: number) => {
  return crypto.randomBytes(bytes).toString('hex');
}