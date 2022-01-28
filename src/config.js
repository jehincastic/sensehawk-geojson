import dotenv from "dotenv";

dotenv.config();

export const __dbUrl__ = process.env.DB_URL;
export const __dbName__ = process.env.DB_NAME;
export const __isProd__ = process.env.Node_ENV === "production";
export const __port__ = process.env.PORT || 3000;
export const __privateKey__ = process.env.PRIVATE_KEY || "";
