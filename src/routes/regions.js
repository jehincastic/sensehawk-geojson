import express from "express";

import Region from "../models/region.js";
import { checkAuth } from "../middlewares/auth.js";
import validationMiddleware from "../middlewares/validation.js";
import {
  regionsAddSchema,
  deleteSchema,
  regionsUpdateSchema,
} from "../validationSchema/index.js";

const handleAuthorizationError = async (_id, next) => {
  const region = await Region.findById(_id);
  if (!region) {
    return next({
      status: 404,
      message: "Region not found",
    });
  }
  return next({
    status: 403,
    message: "You are not allowed to perform this action",
  });
};

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const regions = await Region.find({});
    res.json({
      status: "SUCCESS",
      data: regions,
    })
  } catch (err) {
    console.error(err);
    return next({
      status: 500,
      message: err.message || "Internal server error",
    });
  }
});

router.use(checkAuth);

router.post(
  "/add",
  validationMiddleware(regionsAddSchema),
  async (req, res, next) => {
    try {
      const {
        name,
        description,
        location: {
          type,
          coordinates,
        },
      } = req.body;
      const {
        _id: userId,
      } = res.locals.user;
      const region = await Region.create({
        name,
        description,
        location: {
          type,
          coordinates,
        },
        owner: userId,
      });
      res.status(201).json({
        status: "SUCCESS",
        data: region,
      })
    } catch (err) {
      console.error(err);
      return next({
        status: 500,
        message: err.message || "Internal server error",
      });
    }
  },
);

router.put(
  "/update",
  validationMiddleware(regionsUpdateSchema),
  async (req, res, next) => {
    try {
      const {
        _id,
        name,
        description,
        location: {
          type,
          coordinates,
        },
      } = req.body;
      const {
        _id: userId,
      } = res.locals.user;
      const updatedRegion = await Region.findOneAndUpdate({
        _id,
        owner: userId,
      }, {
        name,
        description,
        location: {
          type,
          coordinates,
        },
      }, {
        new: true,
      });
      if (updatedRegion) {
        return res.json({
          status: "SUCCESS",
          data: updatedRegion,
        });
      }
      await handleAuthorizationError(_id, next);
    } catch (err) {
      console.error(err);
      return next({
        status: 500,
        message: err.message || "Internal server error",
      });
    }
  },
);

router.delete(
  "/delete",
  validationMiddleware(deleteSchema),
  async (req, res, next) => {
    try {
      const {
        _id,
      } = req.body;
      const {
        _id: userId,
      } = res.locals.user;
      const deletedRegion = await Region.findOneAndDelete({
        _id,
        owner: userId,
      });
      if (deletedRegion) {
        return res.status(202).json({
          status: "SUCCESS",
          data: deletedRegion,
        });
      }
      await handleAuthorizationError(_id, next);
    } catch (err) {
      console.error(err);
      return next({
        status: 500,
        message: err.message || "Internal server error",
      });
    }
  },
);

export default router;