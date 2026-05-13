import { Router } from "express";
import authRouter from "../modules/auth/auth.route.js";
import userRouter from "../modules/user/user.route.js";
import categoryRouter from "../modules/category/category.route.js";
import menuItemRouter from "../modules/menu-item/menu-item.route.js";
import customerRouter from "../modules/customer/customer.route.js";
import tableRouter from "../modules/table/table.route.js";
import reservationRouter from "../modules/reservation/reservation.route.js";
import tableSessionRouter from "../modules/tableSession/tableSession.route.js";
import orderRouter from "../modules/order/order.route.js";
import orderItemRouter from "../modules/order/orderItem.route.js";
import paymentRouter from "../modules/payment/payment.route.js";
import serviceCallRouter from "../modules/serviceCall/serviceCall.route.js";
import reviewRouter from "../modules/review/review.route.js";
import activityLogRouter from "../modules/activityLog/activityLog.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/menu-items", menuItemRouter);
router.use("/customers", customerRouter);
router.use("/tables", tableRouter);
router.use("/reservations", reservationRouter);
router.use("/table-sessions", tableSessionRouter);
router.use("/orders", orderRouter);
router.use("/order-items", orderItemRouter);
router.use("/payments", paymentRouter);
router.use("/service-calls", serviceCallRouter);
router.use("/reviews", reviewRouter);
router.use("/activity-logs", activityLogRouter);

export default router;
