import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

export const MessageInput = ({handleInputFocus}) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = React.useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleTyping = (e) => {
    if (!socket || !authUser || !selectedUser) return;
  
    const inputValue = e.target.value; // Get the current input value
    const isBackSpace = e.key === "Backspace";
    
    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);
  
    if (inputValue.trim() === "" || isBackSpace) {
      // If the input is empty, immediately stop typing
      socket.emit("stopTyping", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
      // console.log("Typing stopped due to empty input");
      return;
    }
  
    // Emit typing event
    socket.emit("typing", {
      senderId: authUser._id,
      receiverId: selectedUser._id,
    });
    // console.log("Typing started");
  
    // Set a timeout to stop typing after 1.5 seconds of inactivity
    const newTimeout = setTimeout(() => {
      // console.log("Typing stopped after inactivity");
      socket.emit("stopTyping", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      });
    }, 1500);
  
    // Store the new timeout
    setTypingTimeout(newTimeout);
  };
  

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      // Send the message
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear the input field and image preview
      setText("");
      removeImage();
      setTypingTimeout(null); // Clear typing timeout
      socket.emit("stopTyping", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
      }); // Emit stopTyping when the message is sent
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-20 rounded-lg object-cover border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 size-5 rounded-full bg-base-300 flex justify-center items-center hover:bg-base-200"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onInput={handleTyping} // Call handleTyping when user types
            onFocus={handleInputFocus}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle size-[3.2 rem]"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
