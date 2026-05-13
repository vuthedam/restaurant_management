import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import Payment from "./payment.model.js";

export const createPayment = handleAsync(async (req, res) => {
  const payment = await Payment.create(req.body);
  res.status(201).json(createResponse(true, 201, "Payment created successfully", payment));
});

export const getPayments = handleAsync(async (req, res) => {
  const payments = await Payment.find();
  res
    .status(200)
    .json(createResponse(true, 200, "Payments retrieved successfully", payments));
});

export const getPaymentDetail = handleAsync(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return res.status(404).json(createResponse(false, 404, "Payment not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Payment retrieved successfully", payment));
});

export const updatePayment = handleAsync(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(createResponse(true, 200, "Payment updated successfully", payment));
});

export const deletePayment = handleAsync(async (req, res) => {
  await Payment.findByIdAndDelete(req.params.id);
  res.status(200).json(createResponse(true, 200, "Payment deleted successfully"));
});
