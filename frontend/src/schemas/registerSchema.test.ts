import { describe, it, expect } from "vitest";
import { registerSchema } from "./registerSchema";

describe("Register - tests", () => {
  it("should reject password that they are not equaled", () => {
    const result = registerSchema.safeParse({
      name: "Miłosz",
      email: "miloszdubiel02@wp.pl",
      password: "1qazXSW@",
      confirmPassword: "!QAZxsw2",
    });

    expect(result.success).toBe(false);
  });

  it("should password passes regex", () => {
    const result = registerSchema.safeParse({
      name: "Miłosz",
      email: "miloszdubiel02@wp.pl",
      password: "1qazXSW@",
      confirmPassword: "1qazXSW@",
    });
    expect(result.success).toBe(true);
  });

  it("should reject password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      name: "Jan",
      email: "jan@test.pl",
      password: "Pass1!",
      confirmPassword: "Pass1!",
    });
    expect(result.success).toBe(false);
  });

  it("should reject password without special character", () => {
    const result = registerSchema.safeParse({
      name: "Jan",
      email: "jan@test.pl",
      password: "Passssword",
      confirmPassword: "Passssword",
    });
    expect(result.success).toBe(false);
  });
});
