import { ConnectDB } from "./models/schemas/ConnectDB";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./router/auth.router";
import userRouter from "./router/user.router";

const port = process.env.PORT || 8080;

const app = express();
app.use(cors());

app.set("view engine", "ejs");

app.set("views", "./src/views");

const db = new ConnectDB();
db.connect()
  .then(() => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(bodyParser.json());

app.use("/", authRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log("App running on port: " + port);
});
