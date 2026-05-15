import jwt from "jsonwebtoken";
import handleAsync from "../../common/utils/handleAsync.js";
import { configenv } from "../../common/configs/configenv.js";
import { User } from "../user/user.model.js";

export const registerAuth = handleAsync(async (req, res) => {
  const { email, password, fullName, phone } = req.body;
  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Email đã tồn tại",
    });
  }

  const newUser = await User.create({
    email,
    password,
    fullName,
    phone,
  });
  newUser.password = undefined;
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Đăng ký thành công",
    data: newUser,
  });
});

export const loginAuth = handleAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
    isActive: true,
  }).select("+password");

  if (!user) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Email hoặc mật khẩu không đúng",
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Email hoặc mật khẩu không đúng",
    });
  }

  user.lastLoginAt = new Date();

  await user.save();

  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
      branch: user.branch,
    },
    configenv.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    configenv.JWT_REFRESH_SECRET,
    {
      expiresIn: "15d",
    },
  );

  user.password = undefined;

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Đăng nhập thành công",
    data: { user, accessToken, refreshToken },
  });
});

// refreshToken...
