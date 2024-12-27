import express from 'express'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import cors from 'cors'
import dotenv from 'dotenv'
import {connectDB} from './lib/db.js'
import cookieParser from 'cookie-parser'
import {app, server} from './lib/socket.js'
dotenv.config()


const PORT = process.env.PORT || 5001;
app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({limit:"5mb",extended:true}))
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
server.listen(PORT,()=>{
    console.log('Server is running on port : ', PORT)
    connectDB();
})