import { isAuthenticated } from "../utils/index.js";

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (typeof token !== "string") {
    return next({
      status: 401,
      message: "Invalid Login"
    });
  }
  const {
    authenticated,
    payload,
  } = isAuthenticated(token);
  if (authenticated && payload) {
    res.locals.user = payload;
    return next();
  }
  return next({
    status: 401,
    message: "Invalid Token"
  });
};

export {
  checkAuth,
};