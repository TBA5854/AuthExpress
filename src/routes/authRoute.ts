import { Router } from "express";
import { revokeAdmin, login, logout, signup, makeUserAdmin } from "../controllers/authController"
import { authverify, isAdmin } from "../middleware/authMiddleware";
const router: Router = Router();

router.get('/logout', logout);
router.post('/login', login);
router.post('/signup', signup);
router.get('/adminify', authverify, isAdmin, makeUserAdmin);
router.get('/deadminify', authverify, isAdmin, revokeAdmin);

export default router;
