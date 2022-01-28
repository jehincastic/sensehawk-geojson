// Higher order function to validate request body using yup schema
const validationMiddleware = (schema, type = "body") => async (req, _, next) => {
  try {
    // Validate request body against schema
    if (type === "body") {
      await schema.validate(req.body);
    } else if (type === "params") {
      await schema.validate(req.params);
    } else if (type === "query") {
      await schema.validate(req.query);
    }
    return next();
  } catch (err) {
    // Handle schema validation error
    return next({
      status: 403,
      message: err.message
    });
  }
};

export default validationMiddleware;
