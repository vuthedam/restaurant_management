import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import OrderItem from "./orderItem.model.js";

export const createOrderItem = handleAsync(async (req, res) => {
  const orderItem = await OrderItem.create(req.body);
  res
    .status(201)
    .json(createResponse(true, 201, "Order item created successfully", orderItem));
});

export const getOrderItems = handleAsync(async (req, res) => {
  const orderItems = await OrderItem.find();
  res
    .status(200)
    .json(
      createResponse(true, 200, "Order items retrieved successfully", orderItems),
    );
});

export const getOrderItemDetail = handleAsync(async (req, res) => {
  const orderItem = await OrderItem.findById(req.params.id);
  if (!orderItem) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Order item not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Order item retrieved successfully", orderItem));
});

export const updateOrderItem = handleAsync(async (req, res) => {
  const orderItem = await OrderItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json(createResponse(true, 200, "Order item updated successfully", orderItem));
});

export const deleteOrderItem = handleAsync(async (req, res) => {
  await OrderItem.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(createResponse(true, 200, "Order item deleted successfully"));
});
