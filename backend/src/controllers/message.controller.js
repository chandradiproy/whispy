import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUser);
    } catch (error) {
        console.error("Error in getUsersForSidebar controller ; ", error.message);
        res.status(500).json({
            message: "Internal server error. Please try again"
        })
    }

}

export const getMessages = async (req, res) => {
    try{
        const {id:userToChatId} = req.params;
        const myId = req.user._id;
        const message = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ],
        })
        res.status(200).json(message);
    }catch(error){
        console.error("Error in getMessages controller ; ", error.message);
        res.status(500).json({
            message: "Internal server error. Please try again"
        })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        let imgUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imgUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imgUrl,
            seenBy:[],
        })

        await newMessage.save();
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller ; ", error.message);
        res.status(500).json({
            message: "Internal server error. Please try again"
        })
    }
};
export const markMessageAsSeen = async(req,res)=>{
    try {
        const {messageId} = req.body; //message id will be passed along with the request body
        const userId = req.user._id;
        const message = await Message.findById(messageId);
        if(!message){
            return res.status(404).json(
                {message:"Message not found"}
            )
        }

        if(!message.seenBy.includes(userId)){ //adding user id if message is not seen  by the user
            message.seenBy.push(userId);
            await message.save();
        }else{
            return res.status(400).json({
                message:"Message is already seen"
            })
        }
    } catch (error) {
        console.error("Error in markMessageAsSeen controller ; ", error.message);
        res.status(500).json({
            message: "Internal server error. Please try again"
        });
    }
};