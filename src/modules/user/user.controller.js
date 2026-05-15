import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import { User } from "./user.model.js";

export const createUser = handleAsync(async (req, res) => {
  const user = await User.create(req.body);
  user.password = undefined;
  res.status(201).json(createResponse(true, 201, "User created successfully", user));
});

export const getUsers = handleAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json(createResponse(true, 200, "Users retrieved successfully", users));
});

export const getUserDetail = handleAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json(createResponse(false, 404, "User not found"));
  }
  res.status(200).json(createResponse(true, 200, "User retrieved successfully", user));
});

export const updateUser = handleAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(createResponse(true, 200, "User updated successfully", user));
});

export const deleteUser = handleAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json(createResponse(true, 200, "User deleted successfully"));
});

export const getMe = handleAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json(createResponse(false, 404, "User not found"));
  res.status(200).json(createResponse(true, 200, "OK", user));
});
