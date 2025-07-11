import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import routes from "./routes/index.js"
import configurePassport from "./config/passport.js";
import cors from "cors"

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
  origin : ["http://localhost:5173","https://backstories-cxqf.vercel.app"],
  credentials : true
}))

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


app.use(session({
  secret: process.env.SESSION_SECRET || "devsecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions"
  }),
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      httpOnly: true,
  }
}));

app.set('trust proxy', 1);


app.use(passport.initialize());
app.use(passport.session());

app.get("/",(req,res) => res.send("Hello World"))
app.use("/api",routes)

app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode ?? 500 
  res.status(statusCode).json({ message: err.message });
});

export default app;
