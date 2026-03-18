import express from "express";
import router from "./routes/post.route.js"; //express-es router amit letrehoztunk
import { notFound, errorHandler } from "./middlewares/error.middleware.js"; //hibakezelo middleware-ek
import carRouter from "./routes/car.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  attachUser,
  logger,
  requireApiKey,
  requireLogin,
} from "./middlewares/test.middleware.js";

const app = express(); //express app letrehozasa
app.use(express.json()); //json body feldolgozasahoz (patch, post, barmi amiben json van --> tudjuk ertelmezni)
app.use(express.urlencoded({ extended: true })); //urlencoded = html formok eseten hasznos -->formokbol kinyerni az adatokat
app.use(logger);

//cookie-k olvasása
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-type", "Authorization", "x-api-key"],
  }),
);

//health check = elindul-e az app
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/private", requireApiKey, (req, res) => {
  res.json({ secret: "OScar" });
});

app.get("/me", attachUser, (req, res) => {
  res.json({ user: req.user });
});

app.get("/profile", requireApiKey, attachUser, requireLogin, (req, res) =>
  res.json({ message: `Welcome ${req.user.name}` }),
);

app.use("/api/v1/posts", router); //alapja a post-jainknak.
app.use("/api/v1/cars", carRouter); //alapja a post-jainknak.
app.use("/api/v1/users", userRouter); //alapja a post-jainknak.

// Utana router = ezutan elvalasztja a request-eket.
// Ha ide most post request kerul be --> createPost-ot csinlja meg.
// Ha get request --> getPosts-tal visszadja az osszes post-ot
// router -->hogy viselkedjen az endpoint

app.use(notFound); // ha nincs url. pl. "/api/v1/posts/kiscica" --> nincs ilyen route
app.use(errorHandler); // kozponti error handler --> minden next(err) -rel tovabbadott hiba ide erkezik

export default app;
