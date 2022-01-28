import express from "express";

import {
  __isProd__,
  __port__,
} from "./config.js";
import connectDb from "./db.js";
import inintializeRouter from "./routes/index.js";
import { initSeed } from "./utils/seed.js";

const main = async () => {
  // Initialize db connection
  await connectDb();

  // Initialize express app
  const app = express();
  
  // Parse the request body as JSON
  app.use(express.json());

  // Inintialize the router
  await inintializeRouter(app);

  // Error handling Middleware
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      status: "ERROR",
      message: err.message,
    });
  });

  // Start the server
  app.listen(__port__, () => {
    initSeed().then(() => {
      console.log(`Server is listening on port ${__port__}`);
    });
  });
};

main().catch(console.error);