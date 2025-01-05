
import express from 'express';
import Auth from '../controllers/auth_controller';

const router = express.Router();

router.post('/register', Auth.register);

router.post('/login', Auth.login);

router.post('/logout', Auth.logout);

router.post('/refresh', Auth.refresh);

export default router;