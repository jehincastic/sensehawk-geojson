import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const RegionSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true,
  } 
});

RegionSchema.index({ location: "2dsphere" });

const Region = mongoose.model("Region", RegionSchema);

export default Region;
