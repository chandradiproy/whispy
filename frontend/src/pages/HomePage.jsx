import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
import Sidebar from '../components/Sidebar.jsx';
import NoChatSelected from '../components/NoChatSelected.jsx';
import ChatContainer from '../components/ChatContainer.jsx';

const HomePage = () => {
  const {selectedUser} = useChatStore();
  return (
    <div className='min-h-screen bg-base-200 pt-2  w-screen'>
      <div className='flex items-center  justify-center pt-2 px-2 h-full w-full'>
        <div className='bg-base-100 rounded shadow-xl w-full max-w-4xl h-[calc(100vh-5rem)]'>
          <div className='flex h-full w-full rounded-lg overflow-auto'>
            <Sidebar/>
            {!selectedUser ? <NoChatSelected/> : <ChatContainer/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage