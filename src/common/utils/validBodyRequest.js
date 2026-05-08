import createError from "./createError.js";

const validBodyRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const messages = result.error.issues.map((issue) => {
      const fieldPath = issue.path.length ? issue.path.join(".") : "body";
      return `${fieldPath}: ${issue.message}`;
    });

    return next(createError(400, messages.join("; ")));
  }

  req.body = result.data;
  next();
};

export default validBodyRequest;
