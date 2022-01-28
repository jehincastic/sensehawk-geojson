import mongoose from "mongoose";

import { __dbUrl__ } from "./config.js";

const connectDb = async () => {
  await mongoose.connect(__dbUrl__, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

export default connectDb;
