import mongoose from "mongoose";
import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import TableSession from "../tableSession/tableSession.model.js";
import { User } from "./user.model.js";

async function countWorkDaysThisMonth(userId) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const result = await TableSession.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        startedAt: { $gte: startOfMonth, $lt: startOfNextMonth },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$startedAt",
            timezone: "UTC",
          },
        },
      },
    },
    { $count: "days" },
  ]);

  return result[0]?.days ?? 0;
}

export const createUser = handleAsync(async (req, res) => {
  const user = await User.create(req.body);
  user.password = undefined;
  res
    .status(201)
    .json(createResponse(true, 201, "User created successfully", user));
});

export const getUsers = handleAsync(async (req, res) => {
  const users = await User.find();
  res
    .status(200)
    .json(createResponse(true, 200, "Users retrieved successfully", users));
});

export const getUserDetail = handleAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json(createResponse(false, 404, "User not found"));
  }

  const workDaysThisMonth = await countWorkDaysThisMonth(user._id);
  const userObject = user.toObject();
  userObject.workDaysThisMonth = workDaysThisMonth;

  res
    .status(200)
    .json(createResponse(true, 200, "User retrieved successfully", userObject));
});

export const updateUser = handleAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) {
    return res.status(404).json(createResponse(false, 404, "User not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "User updated successfully", user));
});

export const deleteUser = handleAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json(createResponse(false, 404, "User not found"));
  }
  res.status(200).json(createResponse(true, 200, "User deleted successfully"));
});

export const getMe = handleAsync(async (req, res) => {
  const userId = req.user?.id || req.user?.userId;
  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json(createResponse(false, 404, "User not found"));

  const workDaysThisMonth = await countWorkDaysThisMonth(user._id);
  const userObject = user.toObject();
  userObject.password = undefined;
  userObject.workDaysThisMonth = workDaysThisMonth;

  res.status(200).json(createResponse(true, 200, "OK", userObject));
});
