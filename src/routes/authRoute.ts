import { Router } from "express";
import { detoombify, login, logout, signup, toombify } from "../controllers/authController"
import { authverify, toombverify } from "../middleware/authMiddleware";
const router: Router = Router();

router.get('/logout', logout);
router.post('/login', login);
router.post('/signup', signup);
router.get('/toombify', authverify, toombverify, toombify);
router.get('/detoombify', authverify, toombverify, detoombify);

export default router;
