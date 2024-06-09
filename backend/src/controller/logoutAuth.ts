import { Request, Response } from "express"

export const logout = (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json("Logged out successfully");
    } catch (e: any) {
        res.status(500).json({ msg: "Error in logout controller" });
        console.log(e.message);
    }
} 