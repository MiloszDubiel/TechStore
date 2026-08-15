import { describe, it, expect } from "vitest";
import { attributesSchema, productCreateSchema } from "./productSchema";

const mockProduct = {
  name: "Lenovo G510",
  brand: "Lenovo",
  model: "G510",
  description: "Laptop Lenovo G510 z procesorem Intel Core i5.",
  price: "1499.99",
  stock: "10",
  category_id: "1",
  subcategory_id: "2",

  attributes: [
    {
      parameter_id: 1,
      name: "Disk size",
      label: "Disk size",
      value: 512,
      type: "number",
      required: 1,
      options: [],
    },
  ],
};

describe("productSchema tests", () => {
  it("attributeschema number of property should be positive", () => {
    const result = attributesSchema.safeParse({
      parameter_id: 1,
      name: "Disk size",
      value: 512,
      type: "number",
    });

    expect(result.success).toBe(true);
  });

  it("images should be a file", () => {
    const image = new File(["image"], "laptop.png", {
      type: "image/jpeg",
    });

    const result = productCreateSchema.safeParse({
      ...mockProduct,
      images: [image],
    });

    expect(result.success).toBe(true);
  });

  it("should be rejected if array of images is empty", () => {
    const result = productCreateSchema.safeParse({
      ...mockProduct,
      images: [{ name: "image" }],
    });
    expect(result.success).toBe(false);
  });
});
