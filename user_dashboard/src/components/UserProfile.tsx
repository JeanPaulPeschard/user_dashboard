// src/components/UserProfile.tsx
import React, { useState } from 'react';

interface UserProfileProps {
  user: { id: number; name: string; email: string; bio: string };
  onSave: (updatedUser: { id: number; name: string; email: string; bio: string }) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full px-3 py-2 border rounded-md" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border rounded-md" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" className="w-full px-3 py-2 border rounded-md" />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save</button>
      </form>
    </div>
  );
};

export default UserProfile;
