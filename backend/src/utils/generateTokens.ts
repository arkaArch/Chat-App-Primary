import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { Response } from 'express'

const generateToken = (user_id: string, res: Response) => {
    const token = jwt.sign({user_id}, process.env.JWT_SECRET!, {
        expiresIn: "15d"
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 3600 * 1000,   // miliseconds
        httpOnly: true,  // prevent XSS (cross site scripting) attack
        sameSite: true  // prevent CSRF(Cross site request forgery) attack
    })

    return token;
}

export default generateToken