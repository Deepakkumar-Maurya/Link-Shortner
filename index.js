// ** importing modules
import express from "express";
import http from "http";
import cors from "cors";
import router from "./routes/routes.js";
import connectDB from "./config/db.js";

// ** environment variables
import dotenv from "dotenv";
dotenv.config();

const app = express();

// ** global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ** database connection
connectDB();

// ** routes
app.use(router);

// ** server setup
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
