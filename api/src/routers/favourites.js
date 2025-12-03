/**import { Router } from "express";
import pool from "../database.js";

const router = Router();

// Dummy auth middleware, backend ei kaadu
const auth = (req, res, next) => {
  // Voit laittaa tänne oikean JWT-checkin myöhemmin
  next();
};

// Hae käyttäjän suosikit
router.get("/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT f.id, f.movie_id, m.title, m.release_year, m.poster_url " +
      "FROM favourites f JOIN movies m ON f.movie_id = m.id " +
      "WHERE f.user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch favourites" });
  }
});

// Lisää suosikki
router.post("/", auth, async (req, res) => {
  const { user_id, movie_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO favourites (user_id, movie_id) VALUES ($1, $2) RETURNING *",
      [user_id, movie_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add favourite" });
  }
});

// Poista suosikki
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM favourites WHERE id = $1 RETURNING *",
      [id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Favourite not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete favourite" });
  }
});

export default router;
*/