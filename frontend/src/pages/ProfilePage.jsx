import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Pencil } from 'lucide-react'
const ProfilePage = () => {
  const {authUser, isUpdatingProfile, updateProfile} = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async()=>{
      const base64String = reader.result;
      setSelectedImage(base64String);
      await updateProfile({profilePic: base64String});
    };
  };
  return (
    <main className='w-screen h-screen flex items-center justify-center'>
      <section className='flex flex-col items-center gap-4'>
        <div className='headings'>
          <h1 className='text-3xl font-bold'>Profile Page</h1>
          <p className='text-lg text-center'>This is the profile page</p>
        </div>
        <div className='profile-pic size-25 rounded-full border-4 relative border-primary'>
          <img src={selectedImage || authUser.profilePic} alt={authUser.fullName+"'s profile pic"} className='w-32 h-32 rounded-full object-cover' />
          <label htmlFor="profile-avtar" className={`absolute 
            bottom-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-150
            ${isUpdatingProfile ? "animate-pulse pointer-events-none":""}`}>
            <Camera className='size-5 text-base-200'/>
            <input type='file' id="profile-avtar"
              className='hidden'
              accept='image/*'
              onChange={handleImageChange}
              disabled={isUpdatingProfile}
            />
          </label>
        </div>
      </section>
    </main>
  )
}

export default ProfilePage