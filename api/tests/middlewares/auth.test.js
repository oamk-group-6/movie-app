import { auth } from "../../src/middleware/auth.js";
import jwt from "jsonwebtoken";

describe("auth middleware", () => {
  const secret = process.env.JWT_SECRET || "supersecretkey";

  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("returns 401 if Authorization header is missing", () => {
    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Authorization header missing",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 if token format is invalid", () => {
    req.headers.authorization = "Bearer";

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid token format",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 if token is invalid", () => {
    req.headers.authorization = "Bearer invalidtoken";

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and sets req.user if token is valid", () => {
    const payload = {
      userId: 1,
      email: "test@test.com",
      username: "testuser",
    };

    const token = jwt.sign(payload, secret);
    req.headers.authorization = `Bearer ${token}`;

    auth(req, res, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});