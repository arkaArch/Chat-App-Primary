import { Request, Response, } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import "dotenv/config"
import generateToken from '../utils/generateTokens'

const prisma = new PrismaClient()

const Signup_Schema = z.object({
    username: z.string().trim(),
    fullname: z.string().trim(),
    password: z.string().min(8),
    confirm_password: z.string().min(8),
    gender: z.string(),
}).strict();

export const signup = async (req: Request, res: Response) => {
    const { success } = Signup_Schema.safeParse(req.body);
    if (!success) {
        return res.status(401).json({ msg: "Incorrect Inputs" })
    }

    try {
        const { username, fullname, password, confirm_password, gender } = req.body;

        if (password !== confirm_password) {
            return res.status(401).json({ msg: "Password doesn't match" });
        }

        const user = await prisma.user.findUnique({ where: { username } });
        if (user) {
            return res.status(401).json({ msg: "User already exists" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashed_password = bcrypt.hashSync(password, salt);

        const male_profile_picture = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const female_profile_picture = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const new_user = await prisma.user.create({
            data: {
                username,
                fullname,
                password: hashed_password,
                gender,
                profile_picture: gender === "male" ? male_profile_picture : female_profile_picture
            }
        });

        if (new_user) {
            generateToken(new_user.id, res);

            res.status(200).json({
                id: new_user.id,
                fullname: new_user.fullname,
                username: new_user.username,
                profile_picture: new_user.profile_picture
            });
        } else {
            res.status(500).json({ msg: "Problem ocuurs in database" });
        }
    } catch (e: any) {
        res.status(500).json({ msg: "Error in signup controller" });
        console.log(e.message);

    }
}