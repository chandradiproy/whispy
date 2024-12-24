import {create} from "zustand"
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";


export const useChatStore = create((set)=>({
    message:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    
    getUsers: async () => {
        set({isUsersLoading:true});
        try{
            const res = await axiosInstance.get("/messages/users");
            toast.success("Users fetched successfully");
            set({users:res.data});
            // console.log(JSON.stringify(res.data));
        }catch(err){
            console.error("Error in getUSers ; ", err.message);
            toast.error(err.response.data.message)
        }finally{
            set({isUsersLoading:false});
        }
    },
    getMessages: async (userId)=>{
        set({isMessagesLoading:true});
        try{
            const res = new axiosInstance.get(`/messages/${userId}`);
            set({message:res.data});
        }catch(err){
            console.error("Error in getMessages ; ", err.message);
            toast.error(err.response.data.message)
        }finally{
            set({isMessagesLoading:false});
        }
    },
    setSelectedUser: (selectedUser) => set({selectedUser}),
}))