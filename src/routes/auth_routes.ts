
import express from 'express';
import Auth from '../controllers/auth_controller';

const router = express.Router();

router.post('/register', (req,res) => {
    Auth.register(req,res);    
});

router.post('/login', (req,res) => {
    Auth.login(req,res);    
});


export default router;