import * as yup from "yup";

import { deleteSchema } from "./baseFields.js";

export const getPolygonsSchema = yup.object().shape({
  className: yup.string().optional(),
  area: yup.number().optional(),
  perimeter: yup.number().optional(),
  region: yup.string().optional(),
  polygon: yup.array().of(yup.array().of(yup.array().of(yup.number())).min(4)).optional(),
});

export const polygonsAddSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().optional(),
  classId: yup.number().required(),
  className: yup.string().required(),
  polygon: yup.object().shape({
    type: yup.string().oneOf(["Polygon"]).required(),
    coordinates: yup.array().of(yup.array().of(yup.array().of(yup.number())).min(4)).required(),
  }),
  region: yup.string().required(),
});

export const polygonsUpdateSchema = polygonsAddSchema.concat(deleteSchema);
