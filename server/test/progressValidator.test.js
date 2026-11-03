const test = require("node:test");
const assert = require("node:assert");
const { validationResult } = require("express-validator");

const {
  validateLogBodyWeight,
  validateWeightIdParam,
  validateTimeframeQuery,
} = require("../src/validators/progressValidator");

async function runValidation(rules, body = {}, params = {}, query = {}) {
  const req = { body, params, query };
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
}

test("Progress Validator - accepts valid body weight payload", async () => {
  const result = await runValidation(validateLogBodyWeight, {
    weight: 75.5,
    date: new Date().toISOString(),
    notes: "Morning fasted weight",
  });
  assert.strictEqual(result.isEmpty(), true, "Expected valid body weight to have 0 errors");
});

test("Progress Validator - enforces weight bounds (25-350 kg)", async () => {
  const tooLow = await runValidation(validateLogBodyWeight, {
    weight: 20,
  });
  assert.strictEqual(tooLow.isEmpty(), false);
  assert.ok(tooLow.array().some((e) => e.path === "weight"));

  const tooHigh = await runValidation(validateLogBodyWeight, {
    weight: 360,
  });
  assert.strictEqual(tooHigh.isEmpty(), false);
  assert.ok(tooHigh.array().some((e) => e.path === "weight"));
});

test("Progress Validator - validates weight ID param", async () => {
  const invalidId = await runValidation(validateWeightIdParam, {}, { id: "not-an-id" });
  assert.strictEqual(invalidId.isEmpty(), false);
  assert.ok(invalidId.array().some((e) => e.path === "id"));

  const validId = await runValidation(
    validateWeightIdParam,
    {},
    { id: "507f1f77bcf86cd799439011" }
  );
  assert.strictEqual(validId.isEmpty(), true);
});

test("Progress Validator - validates timeframe query values", async () => {
  const valid = await runValidation(validateTimeframeQuery, {}, {}, { timeframe: "8weeks" });
  assert.strictEqual(valid.isEmpty(), true);

  const invalid = await runValidation(validateTimeframeQuery, {}, {}, { timeframe: "100days" });
  assert.strictEqual(invalid.isEmpty(), false);
  assert.ok(invalid.array().some((e) => e.path === "timeframe"));
});
