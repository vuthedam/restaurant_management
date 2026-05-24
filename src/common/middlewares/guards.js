import authenticate from "./authenticate.js";
import authorize from "./authorize.js";
import { USER_ROLES } from "../constants/user-role.enum.js";

/** Đã đăng nhập (admin hoặc staff) */
export const requireStaff = [authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.STAFF)];

/** Chỉ quản trị viên */
export const requireAdmin = [authenticate, authorize(USER_ROLES.ADMIN)];

export { authenticate };
