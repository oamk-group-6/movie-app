export function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

export function mockReq(overrides = {}) {
  return {
    params: {},
    body: {},
    query: {},
    user: { id: 1 },
    ...overrides,
  };
}

export const mockPoolQuery = (mockReturn) => {
  const pool = require('../../src/database.js').default;
  pool.query = jest.fn().mockResolvedValue({ rows: mockReturn });
  return pool.query;
};