const { describe, it } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server');
const { validateExpenseInput } = require('../middleware/validateExpense');

describe('Expense Tracker API - Middleware & Routing Tests', () => {
  it('GET / should return API metadata and status 200', async () => {
    const res = await request(app).get('/');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.name, 'Expense Tracker REST API');
  });

  it('GET /api/health should respond with status information', async () => {
    const res = await request(app).get('/api/health');
    assert.ok(res.statusCode === 200 || res.statusCode === 503);
    assert.ok(typeof res.body.database === 'object');
    assert.ok(typeof res.body.uptime === 'number');
  });

  it('GET /api/undefined-route should return 404 Not Found', async () => {
    const res = await request(app).get('/api/undefined-route');
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.success, false);
  });
});

describe('Input Validation Middleware Unit Tests', () => {
  const runValidation = (body) => {
    const req = { body };
    let status = 200;
    let jsonResult = null;
    let calledNext = false;

    const res = {
      status: (code) => {
        status = code;
        return {
          json: (data) => {
            jsonResult = data;
          },
        };
      },
    };

    const next = () => {
      calledNext = true;
    };

    validateExpenseInput(req, res, next);
    return { status, jsonResult, calledNext, modifiedBody: req.body };
  };

  it('should reject missing or empty title', () => {
    const result = runValidation({
      title: '   ',
      amount: 100,
      category: 'Food',
      date: '2026-10-24',
    });
    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.calledNext, false);
    assert.ok(result.jsonResult.errors.some((e) => e.field === 'title'));
  });

  it('should reject title shorter than 2 characters', () => {
    const result = runValidation({
      title: 'A',
      amount: 100,
      category: 'Food',
      date: '2026-10-24',
    });
    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.calledNext, false);
    assert.ok(result.jsonResult.errors.some((e) => e.message.includes('2 characters')));
  });

  it('should reject zero or negative amount', () => {
    const result = runValidation({
      title: 'Coffee',
      amount: -50,
      category: 'Food',
      date: '2026-10-24',
    });
    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.calledNext, false);
    assert.ok(result.jsonResult.errors.some((e) => e.field === 'amount'));
  });

  it('should reject invalid non-numeric amount', () => {
    const result = runValidation({
      title: 'Coffee',
      amount: 'abc',
      category: 'Food',
      date: '2026-10-24',
    });
    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.calledNext, false);
    assert.ok(result.jsonResult.errors.some((e) => e.field === 'amount'));
  });

  it('should reject invalid category not in predefined list', () => {
    const result = runValidation({
      title: 'Coffee',
      amount: 120,
      category: 'Cryptocurrency',
      date: '2026-10-24',
    });
    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.calledNext, false);
    assert.ok(result.jsonResult.errors.some((e) => e.field === 'category'));
  });

  it('should reject invalid date', () => {
    const result = runValidation({
      title: 'Coffee',
      amount: 120,
      category: 'Food',
      date: 'not-a-date',
    });
    assert.strictEqual(result.status, 400);
    assert.strictEqual(result.calledNext, false);
    assert.ok(result.jsonResult.errors.some((e) => e.field === 'date'));
  });

  it('should accept valid expense input and sanitize values', () => {
    const result = runValidation({
      title: '  Fresh Vegetables & Milk  ',
      amount: '249.99',
      category: 'Food',
      date: '2026-10-24',
    });
    assert.strictEqual(result.calledNext, true);
    assert.strictEqual(result.modifiedBody.title, 'Fresh Vegetables & Milk');
    assert.strictEqual(result.modifiedBody.amount, 249.99);
    assert.strictEqual(result.modifiedBody.category, 'Food');
    assert.ok(result.modifiedBody.date instanceof Date);
  });
});
