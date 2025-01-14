import { Request, Response, NextFunction } from 'express';
import userModel from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AnyObject } from 'mongoose';
import { error } from 'console';

const register = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("Missing email or password");
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            email: email,
            password: hashedPassword,
        });
        res.status(200).send(user);
    } catch (err) {
        return res.status(500).send(err);
    }
};
const generateTokens = (_id: string): { accessToken: string, refreshToken: string } => {
    const random = Math.floor(Math.random() * 1000000);
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables");
    }
    if (!process.env.TOKEN_EXPIRATION) {
        throw new Error("Missing TOKEN_EXPIRATION in environment variables");
    }
    const accessToken = jwt.sign(
        {
            _id: _id,
            random: random
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION });

    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("Missing REFRESH_TOKEN_SECRET in environment variables");
    }
    if (!process.env.REFRESH_TOKEN_EXPIRATION ) {
        throw new Error("Missing REFRESH_TOKEN_EXPIRATION in environment variables");
    }
    const refreshToken = jwt.sign(
        {
            _id: _id,
            random: random
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });

    return { accessToken, refreshToken };
}

const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("Missing email or password");
    }
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {

            return res.status(400).send("Wrong email or password");

        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send("Invalid password");
        }

        const userId: string = user._id.toString();
        const tokens = generateTokens(userId);
        if (!tokens) {
            return res.status(500).send("missing auth config");

        }
        if (user.refreshTokens == null) {
            user.refreshTokens = [];
        }
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        res.status(200).send({
            email: user.email,
            _id: user._id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (err) {
        return res.status(400).send(err);
    }

};

const logout = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(400).send("missing refresh Token");
    }
    // need to check the refresh token is valid
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(400).send("missing auth config");

    }
    jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
        if (err) {
            return res.status(403).send("Invalid Token");
        }
        const payload = data as TokenPayload;
        try {
            const user = await userModel.findById({ _id: payload._id });
            if (!user) {
                return res.status(400).send("Invalid Token");
            }
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {

                user.refreshTokens = [];
                await user.save();
                return res.status(400).send("Invalid Token");;
            }
            const tokens = user.refreshTokens.filter((token) => token !== refreshToken);
            user.refreshTokens = tokens;
            await user.save();
            res.status(200).send("Logged out");
        } catch (err) {
            return res.status(400).send("Invalid Token");
        }
    });
};
const refresh = async (req: Request, res: Response) => {
    //first validate the refresh token
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(400).send("invalid refresh token");
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).send("missing auth config");
    }
    jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
        if (err) {
            return res.status(403).send("Invalid Token");
        }
        //find the user
        const payload = data as TokenPayload;
        try {
            const user = await userModel.findById({ _id: payload._id });
            if (!user) {
                return res.status(400).send("Invalid Token");

            }
            //check that token existe in the user
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                await user.save();
                return res.status(400).send("Invalid Token");
            }
            //generate a new access token
            const newTokens = generateTokens(user._id.toString());
            if (!newTokens) {
                user.refreshTokens = [];
                await user.save();
                return res.status(400).send("missing auth config");
            }
            //delete the old refresh token
            user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);

            //save the new token in the user
            user.refreshTokens.push(newTokens.refreshToken);
            await user.save();
            //return the new access token and refresh token
            res.status(200).send({
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            });
        } catch (err) {
            return res.status(400).send("Invalid Token");
        }

    });
};

type TokenPayload = {
    _id: string
};

export const authMiddleware = (req, res, next: NextFunction) => {


    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send("missing token");
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).send("missing auth config");

    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(403).send("Invalid Token");
        }

        const payload = data as TokenPayload;
        req.query.userId = payload._id;
        next();
    });
};

export default { register, login, refresh, logout };
