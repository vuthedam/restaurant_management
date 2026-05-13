import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import Table from "./table.model.js";

export const createTable = handleAsync(async (req, res) => {
  const table = await Table.create(req.body);
  res.status(201).json(createResponse(true, 201, "Table created successfully", table));
});

export const getTables = handleAsync(async (req, res) => {
  const tables = await Table.find();
  res
    .status(200)
    .json(createResponse(true, 200, "Tables retrieved successfully", tables));
});

export const getTableDetail = handleAsync(async (req, res) => {
  const table = await Table.findById(req.params.id);
  if (!table) {
    return res.status(404).json(createResponse(false, 404, "Table not found"));
  }
  res.status(200).json(createResponse(true, 200, "Table retrieved successfully", table));
});

export const updateTable = handleAsync(async (req, res) => {
  const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(createResponse(true, 200, "Table updated successfully", table));
});

export const deleteTable = handleAsync(async (req, res) => {
  await Table.findByIdAndDelete(req.params.id);
  res.status(200).json(createResponse(true, 200, "Table deleted successfully"));
});
