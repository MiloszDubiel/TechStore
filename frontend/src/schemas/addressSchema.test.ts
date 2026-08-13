import { describe, expect, it } from "vitest";
import { adressesSchema } from "./addressSchema";

describe("AddressSchema tests ", () => {
  it("should accept valid postal code", () => {
    const result = adressesSchema.safeParse({
      city: "Rzeszów",
      street: "Jakas 9",
      postal_code: "35-001",
      isEdit: false,
      is_default: true,
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid is_default", () => {
    const result = adressesSchema.safeParse({
      city: "Rzeszów",
      street: "Jakas 9",
      postal_code: "35001",
      isEdit: false,
      is_default: 11,
    });

    expect(result.success).toBe(false);
  });
});
