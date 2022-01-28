import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import * as turf from "@turf/turf";

const PolygonSchema = new mongoose.Schema({
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
  classId: {
    type: Number,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  polygon: {
    type: {
      type: String,
      enum: ["Polygon"],
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true,
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

PolygonSchema.index({ polygon: "2dsphere" });

PolygonSchema.virtual("area").get(function () {
  const polygon = turf.polygon(this.polygon.coordinates);
  const area = turf.area(polygon);
  return area;
});

PolygonSchema.virtual("perimeter").get(function () {
  const polygon = turf.polygon(this.polygon.coordinates);
  const perimeter = turf.length(polygon, { units: "meters" });
  return perimeter;
});


const Polygon = mongoose.model("Polygon", PolygonSchema);

export default Polygon;
