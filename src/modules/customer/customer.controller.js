import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import Customer from "./customer.model.js";

export const createCustomer = handleAsync(async (req, res) => {
  const customer = await Customer.create(req.body);
  res
    .status(201)
    .json(createResponse(true, 201, "Customer created successfully", customer));
});

export const getCustomers = handleAsync(async (req, res) => {
  const customers = await Customer.find();
  res
    .status(200)
    .json(
      createResponse(true, 200, "Customers retrieved successfully", customers),
    );
});

export const getCustomerDetail = handleAsync(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Customer not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Customer retrieved successfully", customer));
});

export const updateCustomer = handleAsync(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json(createResponse(true, 200, "Customer updated successfully", customer));
});

export const deleteCustomer = handleAsync(async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(createResponse(true, 200, "Customer deleted successfully"));
});
