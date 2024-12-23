import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "Not authorized to access this route."});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: "Not authorized to access this route."});
        }
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        req.user = user;
        next();
    }catch(err){
        console.error("Error in protectRoute middleware ; ", err.message);
        res.status(500).json({message: "Internal server error. Please try again."});
    }
}