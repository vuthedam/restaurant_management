import { Router } from "express";
import {
  loginAuth,
  registerAuth,
  refreshTokenAuth,
} from "./auth.controller.js";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import {
  loginAuthSchema,
  registerAuthSchema,
  refreshTokenSchema,
} from "./auth.schema.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validBodyRequest(registerAuthSchema),
  registerAuth,
);

authRouter.post("/login", validBodyRequest(loginAuthSchema), loginAuth);
authRouter.post(
  "/refresh-token",
  validBodyRequest(refreshTokenSchema),
  refreshTokenAuth,
);

export default authRouter;
