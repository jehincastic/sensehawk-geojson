import * as yup from "yup";

import { deleteSchema } from "./baseFields.js";

export const regionsAddSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().optional(),
  location: yup.object().shape({
    type: yup.string().oneOf(["Point"]).required(),
    coordinates: yup.array().of(yup.number()).max(2).min(2).required(),
  }),
});

export const regionsUpdateSchema = regionsAddSchema.concat(deleteSchema);
