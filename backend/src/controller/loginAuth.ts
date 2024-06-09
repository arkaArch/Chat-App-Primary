import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import generateToken from '../utils/generateTokens'

const prisma = new PrismaClient()

const Signin_Schema = z.object({
    username: z.string().trim(),
    password: z.string().trim()
}).strict();

export const login = async (req: Request, res: Response) => {
    const { success } = Signin_Schema.safeParse(req.body);
    if (!success) {
        return res.status(401).json({ msg: "Incorrect Inputs" });
    }

    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) {
            return res.status(401).json({ msg: "User doesn't exist" });
        }

        const verify_password = bcrypt.compareSync(password, user.password);
        if(!verify_password) {
            return res.status(401).json({ msg: "Incorrect password" });
        }

        generateToken(user.id, res);

        res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profile_picture: user.profile_picture
        });

    } catch (e: any) {
        res.status(500).json({ msg: "Error in login controller" });
        console.log(e.message);
    }
}