import {create} from "zustand"
import {axiosInstance} from "../lib/axios"
import toast from "react-hot-toast";


export const useAuthStore = create((set)=>({
    authUser:null,
    isSignInUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
/*************  ✨ Codeium Command ⭐  *************/
    /**
     * Checks if the user is authenticated and sets the `authUser` accordingly
     * 
     * @function
     * @returns {Promise<void>}
     */
/******  59db89be-594a-4cc3-9e3b-12046c3f9987  *******/
    checkAuth: async() =>{
        try {
            const response = axiosInstance.get("/auth/check");
            set({authUser:response.data});
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
        window.location("/")
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
        
    }
}))