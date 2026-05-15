import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { userCreateSchema, userUpdateSchema } from "./user.schema.js";
import authenticate from "../../common/middlewares/authenticate.js";
import {
  createUser,
  deleteUser,
  getMe,
  getUserDetail,
  getUsers,
  updateUser,
} from "./user.controller.js";

const userRouter = Router();

userRouter.get("/me", authenticate, getMe);
userRouter.post("/", validBodyRequest(userCreateSchema), createUser);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserDetail);
userRouter.patch("/:id", validBodyRequest(userUpdateSchema), updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
