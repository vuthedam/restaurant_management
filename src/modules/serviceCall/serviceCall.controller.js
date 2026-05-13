import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import ServiceCall from "./serviceCall.model.js";

export const createServiceCall = handleAsync(async (req, res) => {
  const serviceCall = await ServiceCall.create(req.body);
  res
    .status(201)
    .json(
      createResponse(true, 201, "Service call created successfully", serviceCall),
    );
});

export const getServiceCalls = handleAsync(async (req, res) => {
  const serviceCalls = await ServiceCall.find();
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Service calls retrieved successfully",
        serviceCalls,
      ),
    );
});

export const getServiceCallDetail = handleAsync(async (req, res) => {
  const serviceCall = await ServiceCall.findById(req.params.id);
  if (!serviceCall) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Service call not found"));
  }
  res
    .status(200)
    .json(
      createResponse(true, 200, "Service call retrieved successfully", serviceCall),
    );
});

export const updateServiceCall = handleAsync(async (req, res) => {
  const serviceCall = await ServiceCall.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json(
      createResponse(true, 200, "Service call updated successfully", serviceCall),
    );
});

export const deleteServiceCall = handleAsync(async (req, res) => {
  await ServiceCall.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(createResponse(true, 200, "Service call deleted successfully"));
});
