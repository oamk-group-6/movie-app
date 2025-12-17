import upload from "../../src/middleware/upload.js";

describe("upload middleware", () => {
  it("is a multer instance", () => {
    expect(upload).toHaveProperty("fields");
    expect(typeof upload.fields).toBe("function");
  });

  it("generates filename with timestamp and keeps extension", () => {
    const file = { originalname: "image.png" };
    const cb = jest.fn();

    const storage = upload.storage;

    storage.getFilename({}, file, cb);

    expect(cb).toHaveBeenCalledTimes(1);

    const filename = cb.mock.calls[0][1];
    expect(filename).toMatch(/^\d+\.png$/);
  });

  it("uses /app/uploads/ as destination", () => {
    const cb = jest.fn();
    const req = {};
    const file = {};

    const storage = upload.storage;
    storage.getDestination(req, file, cb);

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith(null, "/app/uploads/");
  });
});