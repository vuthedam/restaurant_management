import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import ActivityLog from "./activityLog.model.js";

export const createActivityLog = handleAsync(async (req, res) => {
  const activityLog = await ActivityLog.create(req.body);
  res
    .status(201)
    .json(
      createResponse(true, 201, "Activity log created successfully", activityLog),
    );
});

export const getActivityLogs = handleAsync(async (req, res) => {
  const activityLogs = await ActivityLog.find();
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Activity logs retrieved successfully",
        activityLogs,
      ),
    );
});

export const getActivityLogDetail = handleAsync(async (req, res) => {
  const activityLog = await ActivityLog.findById(req.params.id);
  if (!activityLog) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Activity log not found"));
  }
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Activity log retrieved successfully",
        activityLog,
      ),
    );
});

export const updateActivityLog = handleAsync(async (req, res) => {
  const activityLog = await ActivityLog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json(
      createResponse(true, 200, "Activity log updated successfully", activityLog),
    );
});

export const deleteActivityLog = handleAsync(async (req, res) => {
  await ActivityLog.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(createResponse(true, 200, "Activity log deleted successfully"));
});
