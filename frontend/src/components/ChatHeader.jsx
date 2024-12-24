import React from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { X } from "lucide-react";

export const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUser } = useAuthStore();
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={
                  selectedUser.profilePic ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt={selectedUser.fullName || "User"}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullName || "Jhon Doe"}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUser.includes(selectedUser.id) ? "Active" : "Sleeping"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-ghost btn-sm rounded-full"
        >
          <X />
        </button>
      </div>
    </div>
  );
};
