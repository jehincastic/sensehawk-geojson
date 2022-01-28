import express from "express";

import Polygon from "../models/polygon.js";
import { checkAuth } from "../middlewares/auth.js";
import validationMiddleware from "../middlewares/validation.js";
import {
  deleteSchema,
  polygonsAddSchema,
  polygonsUpdateSchema,
  getPolygonsSchema,
} from "../validationSchema/index.js";

const handleAuthorizationError = async (_id, next) => {
  const polygon = await Polygon.findById(_id);
  if (!polygon) {
    return next({
      status: 404,
      message: "Polygon not found",
    });
  }
  return next({
    status: 403,
    message: "You are not allowed to perform this action",
  });
};

const router = express.Router();

router.get(
  "/",
  validationMiddleware(getPolygonsSchema, "query"),
  async (req, res, next) => {
    try {
      const {
        className,
        area,
        perimeter,
        region,
        polygon,
      } = req.query;
      let polygons = [];
      if (className || region || polygon) {
        const matchObj = {};
        let lookupObj = [];
        let projectObj = [];
        if (className) {
          matchObj.className = className;
        }
        if (region) {
          matchObj["regionData.uid"] = region;
          lookupObj = [
            {
              $lookup: {
                from: "regions",
                localField: "region",
                foreignField: "_id",
                as: "regionData",
              }
            }, {
              $unwind: "$regionData",
            }
          ];
          projectObj = [{
            $project: {
              regionData: 0,
            },
          }];
        }
        if (polygon) {
          matchObj.polygon = {
            $geoWithin: {
              $geometry: {
                type : "Polygon",
                coordinates: JSON.parse(polygon),
              },
            },
          };
        }
        const aggregateArr = [
          ...lookupObj,
          {
            $match: matchObj,
          },
          ...projectObj,
        ];
        polygons = await Polygon.aggregate(aggregateArr);
      } else {
        polygons = await Polygon.find({});
      }
      if (area || perimeter) {
        polygons = polygons.filter(p => {
          const pnew = new Polygon(p).toObject({ virtuals: true });
          const polygonArea = pnew.area;
          const polygonPerimeter = pnew.perimeter;
          if (area && perimeter) {
            return polygonArea === Number(area) && polygonPerimeter === Number(perimeter);
          }
          if (area) {
            return polygonArea === Number(area);
          }
          if (perimeter) {
            return polygonPerimeter === Number(perimeter);
          }
        })
      }
      res.json({
        status: "SUCCESS",
        data: polygons,
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

router.use(checkAuth);

router.post(
  "/add",
  validationMiddleware(polygonsAddSchema),
  async (req, res, next) => {
    try {
      const {
        name,
        description,
        classId,
        className,
        polygon: {
          type,
          coordinates,
        },
        region,
      } = req.body;
      const {
        _id: userId,
      } = res.locals.user;
      const polygon = await Polygon.create({
        name,
        description,
        classId,
        className,
        polygon: {
          type,
          coordinates,
        },
        region,
        owner: userId,
      });
      return res.status(201).json({
        status: "SUCCESS",
        data: polygon,
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

router.put(
  "/update",
  validationMiddleware(polygonsUpdateSchema),
  async (req, res, next) => {
    try {
      const {
        _id,
        name,
        description,
        classId,
        className,
        polygon: {
          type,
          coordinates,
        },
        region,
      } = req.body;
      const {
        _id: userId,
      } = res.locals.user;
      const updatedPolygon = await Polygon.findOneAndUpdate({
        _id,
        owner: userId,
      }, {
        name,
        description,
        classId,
        className,
        polygon: {
          type,
          coordinates,
        },
        region,
      }, {
        new: true,
      });
      if (updatedPolygon) {
        return res.json({
          status: "SUCCESS",
          data: updatedPolygon,
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
      const deletedPolygon = await Polygon.findOneAndDelete({
        _id,
        owner: userId,
      });
      if (deletedPolygon) {
        return res.status(202).json({
          status: "SUCCESS",
          data: deletedPolygon,
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