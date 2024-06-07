import express from "express";
import { signup } from "../controller/signupAuth";
import { login } from "../controller/loginAuth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;