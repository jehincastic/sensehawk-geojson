import argon2 from "argon2";
import mongoose from "mongoose";

import { validateEmail, signJwt } from "../utils/index.js";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: "Email Address is required",
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validateEmail, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true,
  } 
});

UserSchema.pre("save", async function (next) {
  const hashedPassword = await argon2.hash(this.password);
  this.password = hashedPassword;
  next(); 
});

UserSchema.methods.comparePassword = async function (password) {
  const isValid = await argon2.verify(this.password, password);
  return isValid;
};


UserSchema.methods.generateAuthToken = async function () {
  const token = await signJwt({
    _id: this._id,
    name: this.name,
    email: this.email,
  });
  return token;
}

const User = mongoose.model("User", UserSchema);

export default User;
