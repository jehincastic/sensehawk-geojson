import fs from "fs/promises";

import User from "../models/user.js";
import Region from "../models/region.js";
import Polygon from "../models/polygon.js";

export const initSeed = async () => {
  try {
    let data = {
      done: false,
    };
    try {
      data = JSON.parse(await fs.readFile("./done.json", "utf8"));
    } catch (err) {
      console.error(err);
    }
    if (!data.done) {
      const users = await User.insertMany([
        {
          name: "Castic Jehin",
          email: "jehincastic@gmail.com",
          password: "jehincastic@gmail.com"
        }, {
          name: "Desmond Miles",
          email: "desmond.miles@gmail.com",
          password: "desmond.miles@gmail.com"
        }
      ]);
      const [user] = users;
      const regions = await Region.insertMany([
        {
          name: "Chennai",
          description: "Formerly Known as Madras",
          location: {
            type: "Point",
            coordinates: [
              13.04,
              80.17
            ]
          },
          owner: user._id,
        }, {
          name: "Bangalore",
          description: "Silicon Valley of India",
          location: {
            type: "Point",
            coordinates: [
              12.9716,
              77.5946
            ]
          },
          owner: user._id,
        }
      ]);
      const polygonData = regions.map(r => {
        if (r.name === "Bangalore") {
          return {
            name: "Airport",
            description: "Bangalore Airport",
            classId: 101,
            className: "airport",
            polygon: {
              type: "Polygon",
              coordinates: [[[0, 0], [7, 0], [7, 7], [0, 7], [0, 0]]]
            },
            region: r._id,
            owner: user._id,
          }
        }
        return {
          name: "Anna University",
          description: "Anna University is a public state university located in Tamil Nadu",
          classId: 102,
          className: "University",
          polygon: {
            type: "Polygon",
            coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]]
          },
          region: r._id,
          owner: user._id,
        }
      });
      await Polygon.insertMany(polygonData);
      await fs.writeFile("./done.json", JSON.stringify({ done: true }));
    }
    console.log("Done Seeding");
  } catch (err) {
    console.error(err);
  }
};