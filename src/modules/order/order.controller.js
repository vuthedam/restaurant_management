import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import Order from "./order.model.js";

export const createOrder = handleAsync(async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(createResponse(true, 201, "Order created successfully", order));
});

export const getOrders = handleAsync(async (req, res) => {
  const orders = await Order.find();
  res
    .status(200)
    .json(createResponse(true, 200, "Orders retrieved successfully", orders));
});

export const getOrderDetail = handleAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json(createResponse(false, 404, "Order not found"));
  }
  res.status(200).json(createResponse(true, 200, "Order retrieved successfully", order));
});

export const updateOrder = handleAsync(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(createResponse(true, 200, "Order updated successfully", order));
});

export const deleteOrder = handleAsync(async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json(createResponse(true, 200, "Order deleted successfully"));
});
