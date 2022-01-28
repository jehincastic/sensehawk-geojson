import { readFileRecursive } from "../utils/index.js";

const inintializeRouter = async (app) => {
  const promArr = [];
  readFileRecursive(promArr);
  const data = await Promise.all(promArr);
  const isFailed = data.some(d => !d[0]);
  if (isFailed) {
    throw new Error("Could not load all routes");
  };
  data.forEach(([status, { routeName, route }]) => {
    app.use(`/api/v1${routeName}`, route.default);
  });
  app.all("*", (_, res) => {
    res.status(404).json({
      status: "ERROR",
      message: "404 Not Found",
    });
  });
};

export default inintializeRouter;
