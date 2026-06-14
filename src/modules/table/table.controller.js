import QRCode from "qrcode";
import { configenv } from "../../common/configs/configenv.js";
import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import Table from "./table.model.js";

export const getQrList = handleAsync(async (req, res) => {
  const tables = await Table.find({ isActive: true }).sort({ code: 1 });
  const clientUrl = configenv.CLIENT_URL || "https://domain.com";

  const qrList = await Promise.all(
    tables.map(async (table) => {
      const qrUrl = `${clientUrl.replace(/\/$/, "")}/table/${table.qrToken}`;
      const qrImage = await QRCode.toDataURL(qrUrl);
      return {
        id: table._id,
        name: table.name,
        code: table.code,
        qr_token: table.qrToken,
        qr_url: qrUrl,
        qr_image: qrImage,
      };
    })
  );

  res.status(200).json(
    createResponse(true, 200, "Retrieve test QR list successfully", qrList)
  );
});


export const createTable = handleAsync(async (req, res) => {
  const table = await Table.create(req.body);
  res
    .status(201)
    .json(createResponse(true, 201, "Table created successfully", table));
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
  res
    .status(200)
    .json(createResponse(true, 200, "Table retrieved successfully", table));
});

export const updateTable = handleAsync(async (req, res) => {
  const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!table) {
    return res.status(404).json(createResponse(false, 404, "Table not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Table updated successfully", table));
});

export const deleteTable = handleAsync(async (req, res) => {
  const table = await Table.findByIdAndDelete(req.params.id);
  if (!table) {
    return res.status(404).json(createResponse(false, 404, "Table not found"));
  }
  res.status(200).json(createResponse(true, 200, "Table deleted successfully"));
});
