import {Server} from "socket.io"
import http from "http"
import express from "express"
import Message from "../models/message.model.js"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:["http://localhost:5173"],
    }
});

export function getReceiverSocketId(userId){
    
    return userSocketMap[userId];
}

const userSocketMap = {}; //for online users
 
io.on("connection", (socket) => {
    console.log("Connected to socket.io", socket.id);
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    //For typing indicator
    socket.on("typing", ({senderId, receiverId})=>{
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("typing", {senderId});
        }
    });

    socket.on("stopTyping", ({senderId, receiverId})=>{
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("stopTyping",{senderId})
        }
    })

    socket.on("disconnect", () => {
        console.log("Disconnected from socket.io", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })

    socket.on("messageSeen", async ({messageId, senderId, receiverId, seenBy})=>{
        console.log("From messageSeen socket: ",messageId, senderId, receiverId, seenBy);
        try{
            await Message.findByIdAndUpdate(messageId,
                {$addToSet: {seenBy:receiverId}},
                {new:true}
            );

            //notify the sender about the update
            const senderSocketId = getReceiverSocketId(senderId);
            console.log("From messageSeen socket: ",senderSocketId);
            if(senderSocketId){
                io.to(senderSocketId).emit("messageSeen", {messageId, senderId});
            }
        }catch(err){
            console.error('Error in updating seenBy in database', err);
        }
    })
})

export { io, app, server };