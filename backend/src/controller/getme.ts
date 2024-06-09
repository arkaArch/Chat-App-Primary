import { Request, Response } from "express"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getme = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user_id } });
        
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

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