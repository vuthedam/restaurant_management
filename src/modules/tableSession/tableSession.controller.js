import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import TableSession from "./tableSession.model.js";

export const createTableSession = handleAsync(async (req, res) => {
  const tableSession = await TableSession.create(req.body);
  res
    .status(201)
    .json(
      createResponse(true, 201, "Table session created successfully", tableSession),
    );
});

export const getTableSessions = handleAsync(async (req, res) => {
  const tableSessions = await TableSession.find();
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Table sessions retrieved successfully",
        tableSessions,
      ),
    );
});

export const getTableSessionDetail = handleAsync(async (req, res) => {
  const tableSession = await TableSession.findById(req.params.id);
  if (!tableSession) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Table session not found"));
  }
  res
    .status(200)
    .json(
      createResponse(
        true,
        200,
        "Table session retrieved successfully",
        tableSession,
      ),
    );
});

export const updateTableSession = handleAsync(async (req, res) => {
  const tableSession = await TableSession.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json(
      createResponse(true, 200, "Table session updated successfully", tableSession),
    );
});

export const deleteTableSession = handleAsync(async (req, res) => {
  await TableSession.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(createResponse(true, 200, "Table session deleted successfully"));
});
