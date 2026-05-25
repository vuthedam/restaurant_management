import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import {
  userCreateSchema,
  userUpdateSchema,
  userPasswordResetSchema,
} from "./user.schema.js";
import { requireAdmin, authenticate } from "../../common/middlewares/guards.js";
import {
  createUser,
  deleteUser,
  getMe,
  getUserDetail,
  getUsers,
  resetUserPassword,
  updateUser,
} from "./user.controller.js";

const userRouter = Router();

userRouter.get("/me", authenticate, getMe);
userRouter.post(
  "/",
  ...requireAdmin,
  validBodyRequest(userCreateSchema),
  createUser,
);
userRouter.get("/", ...requireAdmin, getUsers);
userRouter.get("/:id", ...requireAdmin, getUserDetail);
userRouter.patch(
  "/:id/password",
  ...requireAdmin,
  validBodyRequest(userPasswordResetSchema),
  resetUserPassword,
);
userRouter.patch(
  "/:id",
  ...requireAdmin,
  validBodyRequest(userUpdateSchema),
  updateUser,
);
userRouter.delete("/:id", ...requireAdmin, deleteUser);

export default userRouter;
