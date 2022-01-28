import * as yup from "yup";

import { emailSchema } from "./baseFields.js";

export const loginSchema = emailSchema.concat(
  yup.object().shape({
    password: yup
      .string()
      .min(8, "Password Must be at least 8 characters.")
      .required("Password is Required."),
  }),
);
