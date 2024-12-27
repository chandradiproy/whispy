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
    // activeUserChatId:null,
    getUsers: async () => {
        set({isUsersLoading:true});
        try{
            const res = await axiosInstance.get("/messages/users");
            // toast.success("Users fetched successfully");
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
            // console.log(JSON.stringify(res.data));
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
            if(newMessage.senderId !== selectedUser._id) return;
            set({
                messages:[...get().messages, newMessage],
            })
        })
    },

    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        socket.off("newMessage");
    },

    markMessageAsSeen: async(messageId)=>{
        // console.log(messageId);
        const {selectedUser, messages} = get();
        const currentUser = useAuthStore.getState().authUser;
        // console.log(currentUser);
        
        const message = messages.find((msg)=>msg._id === messageId);
        if(!message || message.seenBy.includes(currentUser._id)) return; //If already seen, then return

        const updatedSeenBy = [...message.seenBy, currentUser._id]; //adding the current user's id to the array
        set({
            messages: messages.map((msg)=> msg._id === messageId ? {...msg, seenBy:updatedSeenBy} : msg
            )
        });
        const socket = useAuthStore.getState().socket;
        socket.emit("messageSeen",{
            messageId,
            senderId:message.senderId,
            receiverId:message.receiverId,
            seenBy:updatedSeenBy
        });
        // try{
        //     const res = await axiosInstance.put(`/messages/markAsSeen`,{messageId});
        //     console.log(res.data);
        // }catch(err){
        //     console.error("Error in markMessageAsSeen ; ", err.message);
            
        // }
        

    }
}))
