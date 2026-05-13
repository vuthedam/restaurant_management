import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import Category from "./category.model.js";

export const createCategory = handleAsync(async (req, res) => {
  const category = await Category.create(req.body);
  res
    .status(201)
    .json(createResponse(true, 201, "Category created successfully", category));
});

export const getCategories = handleAsync(async (req, res) => {
  const categories = await Category.find();
  res
    .status(200)
    .json(
      createResponse(true, 200, "Categories retrieved successfully", categories),
    );
});

export const getCategoryDetail = handleAsync(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res
      .status(404)
      .json(createResponse(false, 404, "Category not found"));
  }
  res
    .status(200)
    .json(createResponse(true, 200, "Category retrieved successfully", category));
});

export const updateCategory = handleAsync(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(200)
    .json(createResponse(true, 200, "Category updated successfully", category));
});

export const deleteCategory = handleAsync(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(createResponse(true, 200, "Category deleted successfully"));
});
