import {create} from "zustand"
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set,get)=>({
    messages:[],
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
            const res = await axiosInstance.get(`/messages/${userId}`);
            // console.log(res.data);
            if(res.data.length === 0){
                toast.success("No messages found");
            }
            set({messages:res.data});
        }catch(err){
            console.error("Error in getMessages ; ", err.message);
            // toast.error(err.response.data.message)
        }finally{
            set({isMessagesLoading:false});
        }
    },
    setSelectedUser: (selectedUser) => set({selectedUser}),

    sendMessage: async(messageData)=>{
        const {selectedUser, messages} = get();
        // console.table(selectedUser);
        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages:[...messages, res.data]});
        }catch(err){
            console.error("Error in sentMessage ; ", err.message);
            toast.error(err.response.data.message)
        }
    },
    subscribeToMessages: ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage)=>{
            set({
                messages:[...get().messages, newMessage],
            })
        })
    },

    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}))