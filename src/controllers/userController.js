import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserSchema } from "../models/userModel";

const User = mongoose.model('User', UserSchema);

export const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({
            message: 'Unauthorized user',
        });
    }
};

export const register = async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({ ...req.body, hashPassword });
        const user = await newUser.save();
        user.hashPassword = undefined;
        res.status(200).json(user);
    } catch(error) {
        res.status(400).send({
            message: error,
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        });
        if (!user) {
            res.status(401).json({
                message: 'Authentication failed.',
            });
        } else if (user) {
            if (!user.comparePassword(req.body.password, user.hashPassword)) {
                res.status(403).json({
                    message: 'Invalid credentials.',
                });
            } else {
                return res.json({ token: jwt.sign({ email: user.email, username: user.username, _id: user.id }, 'BRUNO_DAS') });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error.',
        });
    }
};