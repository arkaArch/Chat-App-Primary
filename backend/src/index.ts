import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoute"
import messageRoutes from "./routes/messageRoute"

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", messageRoutes);

app.listen(3000, () => {
    console.log("App is listening on port 3000");
})