// src/components/UserForm.tsx
import React, { useState } from 'react';

interface UserFormProps {
  onSubmit: (user: { id: number; name: string; email: string }) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = { id: Math.floor(Math.random() * 1000), name, email };
    onSubmit(newUser);
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="px-3 py-2 border rounded-md w-full"
        />
      </div>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="px-3 py-2 border rounded-md w-full"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
        Add User
      </button>
    </form>
  );
};

export default UserForm;
