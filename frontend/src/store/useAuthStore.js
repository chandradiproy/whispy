import {create} from "zustand"
import {axiosInstance} from "../lib/axios"
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ?  "http://localhost:5001" : "/";
export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSignInUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUser : [],
    socket:null,
    checkAuth: async() =>{
        try {
            const response = axiosInstance.get("/auth/check");
            set({authUser:response.data});
            get.connectSocket();
        } catch (error) {
            console.error("Error in checkAuth ; ", error.message);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },
    signup: async (data)=>{
        set({isSignInUp:true});
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            console.log(response);
            
            set({authUser:response.data});
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSignInUp:false});
        }
    },
    logout: async ()=>{
        
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            console.error("Error in logout ; ", error.message);
            toast.error(error.response.data.message)
        }
    },
    login: async (data)=>{
        try{
            set({isLoggingIn:true});
        const response = await axiosInstance.post("/auth/login", data);
        set({authUser:response.data});
        toast.success("Logged in successfully");
        get().connectSocket();

        }catch(err){
            console.error("Error in login ; ", err.message);
            toast.error(err.response.data.message)
        }finally{
            set({isLoggingIn:false});
        }
    },

    updateProfile : async(data)=>{
        try{
            set({isUpdatingProfile:true});
            const response = await axiosInstance.put("/auth/update-profile", data);
            set({authUser:response.data});
            toast.success("Profile updated successfully");
        }catch(err){
          console.error("Error in updateProfile ; ", err.message);
          toast.error(err.response.data.message)
        }finally{
            set({isUpdatingProfile:false});
        }
        
    },

    connectSocket: ()=>{
        const {authUser} = get();
        if(!authUser || get.socket?.connected) return;
        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id
            },
        });
        socket.connect();
        set({socket});

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUser:userIds})
        })
    },
    disconnectSocket: ()=>{
        if(get().socket?.connected){
            get().socket.disconnect();
        }
        set(({socket:null}));
    },
}))