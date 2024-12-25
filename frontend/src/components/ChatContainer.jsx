import { Send, Paperclip } from "lucide-react"; // Assuming you have lucide-react for icons
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formateMessageTime } from "../lib/utils";
const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    }
  }, [getMessages, selectedUser._id, subscribeToMessages, unsubscribeFromMessages]);
  // console.log(messages);
  useEffect(()=>{
    if(messageEndRef.current && messages){
      messageEndRef.current.scrollIntoView({behavior:"smooth"});
    }
  })
  if (isMessagesLoading)
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  return (
    // <div className="flex-1 flex flex-col overflow-auto">
    //   <ChatHeader/>

    //   <div className="flex flex-1 overflow-y-auto p-4 space-y-4">
    //     {messages.map((message) => {return (
    //       <div
    //         key={message.id}
    //         className={`chat ${message.senderId === authUser._id} ? 'chat-end' : 'chat-start'}`}
    //       >
    //         <div className="chat-image avatar">
    //           <div className="size-10 rounded-full border">
    //             <img
    //               src={message.senderId === authUser._id ? authUser.profilePic || defaultAvatar : selectedUser.profilePic || defaultAvatar}
    //             />
    //           </div>
    //         </div>
    //         <div className="chat-header">
    //           <time className="text-xs opacity-50 ml-1">
    //             {formateMessageTime(message.createdAt)}
    //           </time>
    //         </div>
    //         <div className="chat-bubble flex flex-col">
    //           {message.iamge && (
    //             <img
    //               src={message.image}
    //               alt="Attachment"
    //               className="sm:max-w-[300px] max-h-[300px] object-cover"
    //             />
    //           )}
    //           {message.text && <p>{message.text}</p>}
    //         </div>
    //       </div>
    //     )})}
    //   </div>

    //   <MessageInput/>

    // </div>

    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || defaultAvatar
                      : selectedUser.profilePic || defaultAvatar
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formateMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[300px] max-h-[300px] object-cover"
                />
              )}

              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
