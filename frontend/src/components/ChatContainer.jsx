import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formateMessageTime } from "../lib/utils";
import { Download, X } from "lucide-react";
import toast from "react-hot-toast";

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
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
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


  // useEffect(() => {
  //   if (messageEndRef.current) {
  //     messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // });

  useEffect(() => {
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
    if (messageEndRef.current ) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
  

  //for downloading the uploaded image
  const downloadIage = (url,filename) =>{
    fetch(url)
      .then((response)=>response.blob())
      .then((blob)=>{
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename || "image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error)=>{
        toast.error("Failed to download: ",error.message);
      })
  }


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
                  className="sm:max-w-[300px] max-h-[300px] p-1 object-cover hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                  onClick={() => setFullscreenImage(message.image)}
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
            {isPreviewOpen && fullscreenImage && (
              <div className="fixed w-screen inset-0 bg-black bg-opacity-80 flex justify-center items-center backdrop-blur-md z-50">
                <div className="relative w-screen">
                  <img
                    src={message.image}
                    alt="Fullscreen View"
                    className="max-w-full max-h-screen object-contain"
                  />
                </div>
                <button
                  onClick={()=> downloadIage(message.image, `image_${message._id}.jpg`)}
                  className="absolute size-10 top-5 right-20 bg-gray-700 text-white rounded-full flex items-center justify-center"
                >
                  <Download />
                </button>
                <button
                  onClick={() => setFullscreenImage(null)}
                  className="absolute size-10 top-5 right-5 bg-gray-700 text-white rounded-full flex items-center justify-center"
                >
                  <X />
                </button>
              </div>
            )}
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
