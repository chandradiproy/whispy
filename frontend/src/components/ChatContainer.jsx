import { Send, Paperclip } from "lucide-react"; // Assuming you have lucide-react for icons
import {useChatStore }from "../store/useChatStore";
import { useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser} = useChatStore();
  useEffect(()=>{
    getMessages(selectedUser.id);
  },[getMessages, selectedUser.id]);

  if(isMessagesLoading) return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>
  )
  return (
    // <div className="flex-1 flex flex-col bg-base-100 p-6 md:p-6">
    //   {/* Chat Header */}
    //   <div className="flex items-center justify-between py-3 border-b border-base-300 mb-4">
    //     <div className="flex items-center gap-3">
    //       <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
    //         JD
    //       </div>
    //       <div>
    //         <h3 className="font-semibold text-base-content">John Doe</h3>
    //         <p className="text-xs text-base-content/70">Online</p>
    //       </div>
    //     </div>
    //     <button className="text-primary hover:text-primary/80">
    //       {/* Add an icon for more options */}
    //       <span className="material-icons">more_horiz</span>
    //     </button>
    //   </div>

    //   {/* Chat Messages */}
    //   <div className="flex-1 overflow-y-auto mb-4">
    //     <div className="space-y-4">
    //       <div className="flex justify-start">
    //         <div className="bg-base-200 p-3 rounded-xl max-w-[70%] shadow-sm">
    //           <p className="text-sm">Hey, how are you doing?</p>
    //           <p className="text-[10px] text-base-content/70 mt-1">10:30 AM</p>
    //         </div>
    //       </div>
    //       <div className="flex justify-end">
    //         <div className="bg-primary p-3 text-primary-content rounded-xl max-w-[70%] shadow-sm">
    //           <p className="text-sm">I'm doing great, thanks! How about you?</p>
    //           <p className="text-[10px] text-primary-content/70 mt-1">10:32 AM</p>
    //         </div>
    //       </div>
    //       {/* More messages can be added here */}
    //     </div>
    //   </div>

    //   {/* Message Input Section */}
    //   <div className="flex items-center gap-3 p-2 border-t border-base-300 bg-base-100">
    //     <button className="p-2 rounded-full text-base-content hover:bg-base-200">
    //       <Paperclip size={18} />
    //     </button>
    //     <input
    //       type="text"
    //       placeholder="Type a message..."
    //       className="flex-1 p-2 border border-base-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    //     />
    //     <button className="btn btn-primary px-4 py-2 text-sm rounded-lg">
    //       <Send size={18} />
    //     </button>
    //   </div>
    // </div>
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader/>
      <p>Message...</p>

      <MessageInput/>

    </div>
  );
};

export default ChatContainer;
