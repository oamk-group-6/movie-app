import express from "express";
import cors from "cors";
import "dotenv/config";
import moviesRouter from "./routers/movies.js";
import usersRouter from "./routers/users.js";
import authRouter from "./routers/authRouter.js";
import groupsRouter from "./routers/groups.js";
import listsRouter from "./routers/lists.js";
import commetnsRouter from "./routers/comments.js";
import listMoviesRouter from "./routers/listMovies.js";
import ratingsRouter from "./routers/ratings.js";


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.send("Postgres API esimerkki");
});

app.use("/movies", moviesRouter);
app.use("/users", usersRouter);
app.use("/groups", groupsRouter);
app.use("/lists", listsRouter);
app.use("/comments", commetnsRouter);
app.use("/auth", authRouter);
app.use("/lists-movies", listMoviesRouter);
app.use("/ratings", ratingsRouter);

app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
