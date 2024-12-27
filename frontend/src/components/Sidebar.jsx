import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import SidebarSkeleton from "./SidebarSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    
  } = useChatStore();
  const { onlineUser,  socket } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = React.useState(false);
  const [typingUsers, setTypingUsers] = React.useState([]); // Keep track of typing users

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUser.includes(user._id))
    : users;

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (socket?.connected) {
      // console.log("Socket connected");
  
      socket.on("typing", ({ senderId  }) => {
        // console.log("Typing event received: ", senderId, );
        if ( !typingUsers.includes(senderId)) {
          setTypingUsers((prevTypingUsers) => [...prevTypingUsers, senderId]);
          // console.log("Typing users: ", typingUsers);
        }
      });
  
      socket.on("stopTyping", ({ senderId  }) => {
        // console.log("Stop typing event received: ", senderId, );
        if(typingUsers.includes(senderId)){
          setTypingUsers((prevTypingUsers) =>
            prevTypingUsers.filter((id) => id !== senderId)
          );
          // console.log("Typing stopped users: ", typingUsers);
        }
        
      });
    } else {
      console.log("Socket not connected");
    }
  
    return () => {
      if (socket?.connected) {
        socket.off("typing");
        socket.off("stopTyping");
      }
    };
  }, [socket,typingUsers]);
  

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-3">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Online users */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Actives only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUser.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={
                  user.profilePic ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt={user.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              {onlineUser.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-[0.7rem] text-zincc-400">
                {onlineUser.includes(user._id) ? "Active" : "Sleeping"}
              {typingUsers.includes(user._id) && (
                <div className="text-sm text-zinc-400">Typing...</div>
              )}
              </div>
              {/* Typing Indicator */}
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No active users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
