import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_CRYPTO_KEY;

export const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decryptData = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
