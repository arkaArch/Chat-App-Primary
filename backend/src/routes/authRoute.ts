import express from "express";
import { signup } from "../controller/signupAuth";
import { login } from "../controller/loginAuth";
import { logout } from "../controller/logoutAuth";
import { protectedRoute } from "../middleware/protectedRoute";
import { getme } from "../controller/getme";

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectedRoute, getme);

export default router;