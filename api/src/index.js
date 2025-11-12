import express from "express";
import cors from "cors";
import "dotenv/config";
import moviesRouter from "./routers/movies.js";
import usersRouter from "./routers/users.js";
import authRouter from "./routers/authRouter.js";

import bookRouter from "./routers/book_router.js";


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.send("Postgres API esimerkki");
});

app.use("/book", bookRouter);
app.use("/movies", moviesRouter)
app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
