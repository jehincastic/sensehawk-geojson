import express from "express";

import validationMiddleware from "../middlewares/validation.js";
import User from "../models/user.js";
import {
  loginSchema,
  signUpSchema,
} from "../validationSchema/index.js";

const router = express.Router();

router.post(
  "/login",
  validationMiddleware(loginSchema),
  async (req, res, next) => {
    try {
      const {
        email,
        password,
      } = req.body;
      const user = await User.findOne({
        email,
      });
      if (user) {
        const isValid = await user.comparePassword(password);
        if (isValid) {
          const token = await user.generateAuthToken();
          return res.json({
            status: "SUCCESS",
            data: {
              user: {
                name: user.name,
                email: user.email,
                _id: user._id,
              },
              token,
            },
          });
        }
      }
      return next({
        status: 404,
        message: "Invalid Email or Password",
      });
    } catch (err) {
      console.error(err);
      return next({
        status: 500,
        message: err.message || "Internal server error",
      });
    }
  },
);

router.post(
  "/register",
  validationMiddleware(signUpSchema),
  async (req, res, next) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;
      const user = await User.create({
        name,
        email,
        password,
      });
      const token = await user.generateAuthToken();
      return res.status(201).json({
        status: "SUCCESS",
        data: {
          user: {
            name: user.name,
            email: user.email,
            _id: user._id,
          },
          token,
        },
      });
    } catch (err) {
      if (err.code === 11000) {
        return next({
          status: 409,
          message: "Email Address already exists",
        });
      }
      console.error(err);
      return next({
        status: 500,
        message: err.message || "Internal server error",
      });
    }
  },
);

export default router;
