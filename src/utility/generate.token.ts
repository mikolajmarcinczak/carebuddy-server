import * as crypto from "crypto";

export const generateToken = async (bytes: number) => {
  return crypto.randomBytes(bytes).toString('hex');
}

export const hashToken = async (token: string) => {
  return crypto.createHash('sha512').update(token).digest('hex');
}