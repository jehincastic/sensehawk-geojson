import * as yup from "yup";

import { loginSchema } from "./login.js";

export const signUpSchema = loginSchema.concat(
  yup.object().shape({
    name: yup
      .string()
      .matches(/^[A-Za-z ]*$/, "Please enter valid name")
      .max(40)
      .required("Name is Required."),
  }),
);
