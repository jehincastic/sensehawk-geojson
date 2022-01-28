import * as yup from "yup";

export const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email.")
    .required("Email is Required."),
});

export const deleteSchema = yup.object().shape({
  _id: yup.string().required(),
});