import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import multer from "multer";
import log from "./logger"; //logger doesnt block I/O like console.log does
import connect from "./db/connect";
import cors from "cors";
dotenv.config();

import Route from "./routes/routes";

const upload = multer({ dest: "uploads/" });

const PORT = process.env.PORT as any;
const HOST = process.env.HOST as string;

const app = express();

//middleware
const dev = process.env.NODE_ENV !== "production";
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3025",
  "http://localhost:3040",
  "http://120.0.0.1:3025",
  "https://hizbasvarietystore.com.ng",
];
var corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin && dev) {
      //for bypassing postman req with  no origin
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/", Route);
app.get("/", (req, res) =>
  res.status(200).send("Welcome to Hizbas Variety Store")
);
app.get("*", (req, res) => res.status(404).send("Page not found"));

app.listen(PORT, HOST, () => {
  log.info(
    `<<< Server Environment: ${
      process.env.NODE_ENV
        ? process.env.NODE_ENV.toUpperCase()
        : "ENVIRONMENT IS UNDEFINED, PLS SET YOUR ENV VARIABLES"
    } >>>`
  );
  log.info(`Server listening at http://${HOST}:${PORT}/api/v1`);
  connect();
});
