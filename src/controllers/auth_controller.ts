import { Request, Response, NextFunction } from 'express';
import userModel from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req:Request, res:Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
        return res.status(400).send("Missing email or password");
    }
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            email: email,
            password: hashedPassword,
        });
        return res.status(200).send(user);
    }catch(err){
        return res.status(500).send(err);
    }
};

const login = async (req:Request, res:Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
        return res.status(400).send("Missing email or password");
    }
    try{
        const user = await userModel.findOne({email: email});
        if(!user){
            return res.status(400).send("Wrong email or password");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).send("Invalid password");
        }

        if(!process.env.ACCESS_TOKEN_SECRET){
            return res.status(500).send("missing auth config");
        }
        const token = jwt.sign(
            {_id: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: process.env.TOKEN_EXPIRATION});
        return res.status(200).send({
            email: user.email,
            _id: user._id,
            token: token,
        }); 
        }catch(err){
        return res.status(400).send(err);
    }

};

type TokenPayload = {
    _id: string
}
export const authMiddleware = (req,res, next: NextFunction) => {
    

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if(!token){
        res.status(401).send("missing token");
        return;
    }
    if(!process.env.ACCESS_TOKEN_SECRET){
        res.status(500).send("missing auth config");
        return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if(err){
            res.status(403).send("Invalid Token");
            return;
        }
        
        const payload = data as TokenPayload;
        req.query.userId = payload._id;
        next();
    });
};

export default {register, login};
