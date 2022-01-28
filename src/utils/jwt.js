import jwt from "jsonwebtoken";
import { __privateKey__ } from "../config.js";

// To split the incoming token into parts
export const splitToken = (bearer) => {
  const token = bearer?.split?.("Bearer ")?.[1];
  return token || "";
};

// Verify the token based on the secret
export const verifyJwt = (token) => {
  const payload = jwt.verify(token, __privateKey__ || "");
  return payload;
};

// Check if the token is valid
export const isAuthenticated = (bearerToken) => {
  try {
    const token = splitToken(bearerToken);
    if (token) {
      const userInfo = verifyJwt(token);
      return {
        authenticated: true,
        payload: userInfo,
      };
    }
    return {
      authenticated: false,
    };
  } catch (err) {
    return {
      authenticated: false,
    };
  }
};

// Sign the token with the secret and payload
export const signJwt = user => new Promise((res, rej) => {
  jwt.sign(
    user,
    __privateKey__ || "",
    (err, token) => {
      if (err) {
        rej(err);
      } else if (token) {
        res(token);
      } else {
        rej(new Error("Invalid Input..."));
      }
    },
  );
});
