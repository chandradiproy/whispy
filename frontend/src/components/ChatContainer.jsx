import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formateMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    markMessageAsSeen,
  } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const [typingUser, setTypingUser] = useState(null);
  const messageEndRef = useRef(null);
  const messageRefs = useRef([]);
  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // useEffect(() => {
  //   const handleIntersection = (entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         const messageId = entry.target.id;
  //         const message = messages.find((msg) => msg._id === messageId);
  //         if (message && message.senderId !== authUser._id) {
  //           // Emit the 'messageSeen' event when the receiver sees the message
  //           // socket.emit("messageSeen", { messageId, senderId: message.senderId, receiverId: authUser._id });
  //           markMessageAsSeen(messageId);
  //         }
  //       }
  //     });
  //   };

  //   const observer = new IntersectionObserver(handleIntersection, {
  //     threshold: 0.5, // 50% visibility
  //   });

  //   const validMessageElements = messageRefs.current.filter(
  //     (el) => el && el instanceof HTMLElement
  //   );

  //   validMessageElements.forEach((el) => observer.observe(el));

  //   return () => {
  //     validMessageElements.forEach((el) => observer.unobserve(el));
  //   };
  // }, [socket, authUser._id, messages,markMessageAsSeen]);

  useEffect(() => {
    if (!socket || !authUser) return;

    const handleTyping = ({ senderId }) => {
      if (senderId !== authUser._id) {
        setTypingUser(senderId);
      }
    };
    const handleStopTyping = ({ senderId }) => {
      if (senderId === typingUser) {
        setTypingUser(null);
      }
    };

    if (socket) {
      socket.on("typing", handleTyping);
      socket.on("stopTyping", handleStopTyping);
    }

    return () => {
      if (socket) {
        socket.off("typing", handleTyping);
        socket.off("stopTyping", handleStopTyping);
      }
    };
  }, [socket, authUser, typingUser]);

  useEffect(() => {
    if (!selectedUser) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    // if(socket){
    //   socket.on("messageSeen", ({messageId, senderId})=>{
    //     const updatedMessages = messages.map((msg)=>{
    //       if(msg._id === messageId){
    //         return {...msg, seenBy:[...msg.seenBy, senderId]}
    //       }
    //       return msg;
    //     })
    //     useChatStore.setState({messages:updatedMessages});
    //   });
    // }

    return () => {
      unsubscribeFromMessages();
    //   if(socket){
    //     socket.off("messageSeen");
    //   }
    };
  }, [getMessages, selectedUser, subscribeToMessages, unsubscribeFromMessages]);

  // useEffect(() => {
  //   if (!socket || !authUser) return;

  //   // Listen for the "messageSeen" event from the server
  //   const handleMessageSeen = ({ messageId, senderId }) => {
  //     const updatedMessages = messages.map((message) => {
  //       if (message._id === messageId && message.senderId === senderId) {
  //         return {
  //           ...message,
  //           seenBy: [...message.seenBy, authUser._id], // Add receiver to seenBy list
  //         };
  //       }
  //       return message;
  //     });

  //     // setMessages(updatedMessages);
  //   };

  //   socket.on("messageSeen", handleMessageSeen);

  //   return () => {
  //     socket.off("messageSeen", handleMessageSeen);
  //   };
  // }, [socket, authUser, messages]);
useEffect(()=>{
  if(messageEndRef.current){
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
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id}
            id={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            // ref={(el) => (messageRefs.current[index] = el)} // Ensure ref is properly assigned
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
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

              {/* <div className="chat-footer text-xs opacity-50">
                <div className="flex items-center">
                  <span
                    className={`${
                      message.seenBy.includes(selectedUser._id)
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    <i className="fa fa-check-circle"></i>
                    <i
                      className={`fa fa-check-circle ml-1 ${
                        message.seenBy.includes(selectedUser._id)
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    ></i>
                  </span>
                </div>
              </div> */}
              
            </div>
          </div>
        ))}
        <div className="typing-indicator flex items-center space-x-1">
          {typingUser === selectedUser._id && (
            <>
              <span
                className="dot size-1 bg-gray-500 rounded-full animate-grow"
                style={{ animationDelay: "0s" }}
              ></span>
              <span
                className="dot size-1 bg-gray-500 rounded-full animate-grow"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="dot size-1 bg-gray-500 rounded-full animate-grow"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </>
          )}
        </div>
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
