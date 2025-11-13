import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  //Oletetaan että token on muodossa "Bearer <token>" ja otetaan vain token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    req.user = decoded;
    next();
  } catch (err) {
    //Virheellinen tai vanhentunut token
    console.error("Invalid token:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
