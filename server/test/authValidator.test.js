const test = require("node:test");
const assert = require("node:assert");
const { validationResult } = require("express-validator");

const {
  validateRegister,
  validateLogin,
  validateChangePassword,
} = require("../src/validators/authValidator");

async function runValidation(rules, body = {}) {
  const req = { body };
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
}

test("Auth Validator - accepts valid registration payload", async () => {
  const result = await runValidation(validateRegister, {
    name: "Alex Hunter",
    email: "alex@example.com",
    password: "Password123!",
  });
  assert.strictEqual(result.isEmpty(), true);
});

test("Auth Validator - rejects invalid registration email or short password", async () => {
  const invalidEmail = await runValidation(validateRegister, {
    name: "Alex",
    email: "not-an-email",
    password: "Password123!",
  });
  assert.strictEqual(invalidEmail.isEmpty(), false);
  assert.ok(invalidEmail.array().some((e) => e.path === "email"));

  const shortPassword = await runValidation(validateRegister, {
    name: "Alex",
    email: "alex@example.com",
    password: "short",
  });
  assert.strictEqual(shortPassword.isEmpty(), false);
  assert.ok(shortPassword.array().some((e) => e.path === "password"));
});

test("Auth Validator - accepts valid change password payload", async () => {
  const result = await runValidation(validateChangePassword, {
    currentPassword: "OldPassword123!",
    newPassword: "NewSecurePassword456!",
  });
  assert.strictEqual(result.isEmpty(), true);
});

test("Auth Validator - change password enforces currentPassword required and newPassword min length", async () => {
  const missingCurrent = await runValidation(validateChangePassword, {
    currentPassword: "",
    newPassword: "NewSecurePassword456!",
  });
  assert.strictEqual(missingCurrent.isEmpty(), false);
  assert.ok(missingCurrent.array().some((e) => e.path === "currentPassword"));

  const shortNew = await runValidation(validateChangePassword, {
    currentPassword: "OldPassword123!",
    newPassword: "123",
  });
  assert.strictEqual(shortNew.isEmpty(), false);
  assert.ok(shortNew.array().some((e) => e.path === "newPassword"));
});
