const {
  registerSchema, loginSchema, reportSchema, reportUpdateSchema, statusSchema
} = require('../src/validation/schemas');

describe('request validation', () => {
  test('rejects short passwords', () => {
    expect(() => registerSchema.parse({
      name: 'Alex Example', email: 'alex@example.test', password: 'short'
    })).toThrow();
  });

  test('rejects unexpected registration fields', () => {
    expect(() => registerSchema.parse({
      name: 'Alex Example', email: 'alex@example.test',
      password: 'a-long-password', role: 'admin'
    })).toThrow();
  });

  test('accepts a valid report', () => {
    expect(reportSchema.parse({
      title: 'Broken streetlight', description: 'A light is broken near the sample park.',
      category: 'infrastructure', location: 'Example Road'
    }).category).toBe('infrastructure');
  });

  test('rejects invalid report categories', () => {
    expect(() => reportSchema.parse({
      title: 'Broken streetlight', description: 'A light is broken near the sample park.',
      category: 'made-up', location: 'Example Road'
    })).toThrow();
  });

  test('requires at least one field for report updates', () => {
    expect(() => reportUpdateSchema.parse({})).toThrow();
  });

  test('rejects unsupported status transitions', () => {
    expect(() => statusSchema.parse({ status: 'admin-approved' })).toThrow();
  });

  test('validates login email', () => {
    expect(() => loginSchema.parse({ email: 'not-an-email', password: 'x' })).toThrow();
  });
});
