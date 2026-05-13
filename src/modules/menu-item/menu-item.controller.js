import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import MenuItem from "./menu-item.model.js";

export const createMenuItem = handleAsync(async (req, res) => {
  const menuItem = await MenuItem.create(req.body);
  res
    .status(201)
    .json(createResponse(true, 201, "Menu item created successfully", menuItem));
});

export const getMenuItems = handleAsync(async (req, res) => {
  const menuItems = await MenuItem.find();
  res
    .status(200)
    .json(
      createResponse(true, 200, "Menu items retrieved successfully", menuItems),
    );
});

export const getMenuItemDetail = handleAsync(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);
  if (!menuItem) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Menu item not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Menu item retrieved successfully", menuItem));
});

export const updateMenuItem = handleAsync(async (req, res) => {
  const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json(createResponse(true, 200, "Menu item updated successfully", menuItem));
});

export const deleteMenuItem = handleAsync(async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(createResponse(true, 200, "Menu item deleted successfully"));
});
