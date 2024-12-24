// import { Home, MessageSquare, Users, Settings } from "lucide-react"; // Assuming you use lucide-react for icons

// const Sidebar = () => {
//   return (
//     <div className="bg-base-100 h-full w-[250px] md:w-[300px] flex flex-col border-r border-base-300">
//       {/* Sidebar Header */}
//       <div className="flex items-center justify-between p-4 border-b border-base-300">
//         <h2 className="text-xl font-semibold text-primary">ChatApp</h2>
//         <button className="md:hidden text-primary">
//           <span className="material-icons">menu</span>
//         </button>
//       </div>

//       {/* Sidebar Navigation */}
//       <nav className="flex flex-col gap-2 p-4 flex-1">
//         <SidebarItem icon={<Home size={20} />} label="Home" active />
//         <SidebarItem icon={<MessageSquare size={20} />} label="Chats" />
//         <SidebarItem icon={<Users size={20} />} label="Contacts" />
//         <SidebarItem icon={<Settings size={20} />} label="Settings" />
//       </nav>

//       {/* Sidebar Footer */}
//       <div className="p-4 border-t border-base-300">
//         <p className="text-xs text-base-content/70">Version 1.0</p>
//       </div>
//     </div>
//   );
// };

// const SidebarItem = ({ icon, label, active }) => {
//   return (
//     <button
//       className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-base-200 ${
//         active ? "bg-base-200" : "hover:bg-base-200/50"
//       }`}
//     >
//       {icon}
//       <span className="text-sm font-medium">{label}</span>
//     </button>
//   );
// };

// export default Sidebar;

import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
const Sidebar = () => {
    const{getUsers, users, selectedUser, setSelectedUser, isUsersLoading} = useChatStore();
   const {onlineUser} = useAuthStore();
    useEffect(()=>{
        getUsers();
    },[getUsers]);

    if(isUsersLoading) return <SidebarSkeleton/>
  return (
    <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
        <div className='border-b border-base-300 w-full p-5'>
            <div className='flex items-center gap-3'>
                <Users className='size-6'/>
                <span className='font-medium hidden lg:block'>Contacts</span>
            </div>

            {/* Online users */}
        </div>
        <div className = "overflow-y-auto w-full py-3">
            {users.map((user)=>{
                return (<button
                    key={user._id}
                    onClick={()=>setSelectedUser(user)}
                    className={`w-full p-3 flex items-center gap-3
                    hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300":""}`}
                >
                    <div className='relative mx-auto lg:mx-0'>
                        <img 
                            src={user.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                            alt={user.name || "User"}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {onlineUser.includes(user._id) && (
                            <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900'/>
                        )}
                    </div>

                    <div className='hidden lg:block text-left min-w-0'>
                        <div className='font-medium truncate'>{user.fullName}</div>
                        <div className='text-[0.7rem] text-zincc-400'>
                            {onlineUser.includes(user._id) ? "Active" : "Sleeping"}
                        </div>
                    </div>

                </button>)
            })}
        </div>

    </aside>
  )
}

export default Sidebar