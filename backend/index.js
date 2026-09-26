

import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors"
// import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import artistRoute from "./routes/artistRoute.js";
import artworkRoute from "./routes/artworkRoute.js";
import commissionRoute from "./routes/commissionRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";

// configDotenv();

connectDB();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/artists", artistRoute);
app.use("/api/artworks", artworkRoute);
app.use("/api/commissions", commissionRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/dashboard", dashboardRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`); 
});

