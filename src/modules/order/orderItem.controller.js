import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import createError from "../../common/utils/createError.js";
import OrderItem from "./orderItem.model.js";
import Order from "./order.model.js";

export async function recalculateOrder(orderId, reqUser = null, updates = {}) {
  const order = await Order.findById(orderId);
  if (!order) return;

  const allItems = await OrderItem.find({ orderId: order._id });

  // 1. Recalculate subtotal and finalAmount (exclude cancelled items)
  let newSubtotal = 0;
  allItems.forEach((item) => {
    if (item.status !== "cancelled") {
      newSubtotal += (item.subtotal ?? (item.price * item.quantity));
    }
  });

  order.subtotal = newSubtotal;
  order.finalAmount = Math.max(0, newSubtotal - (order.discount || 0));

  // 2. Recalculate Order status
  if (allItems.length === 0) {
    order.status = "pending";
  } else {
    const statuses = allItems.map((item) => item.status);
    if (statuses.every((s) => s === "cancelled")) {
      order.status = "cancelled";
    } else if (statuses.every((s) => s === "served" || s === "cancelled")) {
      order.status = "served";
    } else if (statuses.includes("preparing")) {
      order.status = "preparing";
    } else if (statuses.includes("confirmed")) {
      order.status = "confirmed";
    } else if (statuses.includes("pending")) {
      order.status = "pending";
    }
  }

  // Set staff handlers if transition occurs and reqUser is provided
  if (reqUser) {
    if (updates.status === "confirmed" && !order.confirmedBy) {
      order.confirmedBy = reqUser.id;
    }
    if (updates.status === "served" && !order.servedBy) {
      order.servedBy = reqUser.id;
    }
  }

  await order.save();
}

export const createOrderItem = handleAsync(async (req, res) => {
  const orderItem = await OrderItem.create(req.body);
  await recalculateOrder(orderItem.orderId, req.user, { status: orderItem.status });
  res.status(201).json(createResponse(true, 201, "Order item created successfully", orderItem));
});

export const getOrderItems = handleAsync(async (req, res) => {
  const { orderId } = req.query;
  const filter = {};
  if (orderId) filter.orderId = orderId;

  const orderItems = await OrderItem.find(filter)
    .populate("menuItemId", "name price image")
    .populate("orderId", "orderNumber tableId status")
    .sort({ createdAt: 1 });

  res.status(200).json(createResponse(true, 200, "Order items retrieved successfully", orderItems));
});

export const getOrderItemDetail = handleAsync(async (req, res) => {
  const orderItem = await OrderItem.findById(req.params.id)
    .populate("menuItemId", "name price image");
  if (!orderItem) throw createError(404, "Order item not found");
  res.status(200).json(createResponse(true, 200, "Order item retrieved successfully", orderItem));
});

export const updateOrderItem = handleAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const orderItem = await OrderItem.findById(id);
  if (!orderItem) throw createError(404, "Order item not found");

  // Recalculate subtotal if quantity or price is modified
  if (updates.quantity !== undefined || updates.price !== undefined) {
    const qty = updates.quantity !== undefined ? updates.quantity : orderItem.quantity;
    const prc = updates.price !== undefined ? updates.price : orderItem.price;
    updates.subtotal = qty * prc;
  }

  // Apply updates to the order item
  Object.assign(orderItem, updates);
  await orderItem.save();

  // Recalculate parent order
  await recalculateOrder(orderItem.orderId, req.user, updates);

  res.status(200).json(createResponse(true, 200, "Order item updated successfully", orderItem));
});

export const deleteOrderItem = handleAsync(async (req, res) => {
  const { id } = req.params;
  const orderItem = await OrderItem.findById(id);
  if (!orderItem) throw createError(404, "Order item not found");

  const orderId = orderItem.orderId;
  await OrderItem.findByIdAndDelete(id);

  // Recalculate parent order
  await recalculateOrder(orderId, req.user);

  res.status(200).json(createResponse(true, 200, "Order item deleted successfully"));
});
