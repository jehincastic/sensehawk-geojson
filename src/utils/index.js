import fs from "fs";

const importFile = async (path, routeName) => {
  try {
    const route = await import(path);
    return [true, { routeName, route }];
  } catch (err) {
    console.error(err);
    return [false, err];
  }
};

export const readFileRecursive = (promArr, basePath = "/") => {
  fs.readdirSync(`./src/routes${basePath}`, { withFileTypes: true }).forEach((file) => {
    if (file.isFile()) {
      if (!(file.name === "index.js" && basePath === "/")) {
        const fileName = file.name;
        const routeName = basePath + fileName.replace(".js", "");
        promArr.push(importFile(`../routes${basePath}${fileName}`, routeName));
      }
    }
    if (file.isDirectory()) {
      const baseName = file.name;
      readFileRecursive(promArr, `${basePath}${baseName}/`);
    }
  });
};

export * from "./validators.js";
export * from "./jwt.js";
export * from "./seed.js";