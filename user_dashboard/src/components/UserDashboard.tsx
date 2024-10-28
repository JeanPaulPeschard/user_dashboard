// src/components/UserDashboard.tsx
import React, { useReducer, useEffect, useCallback, useMemo, useRef, useLayoutEffect, useState } from 'react';
import UserForm from './UserForm';
import Notification from './Notification';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  notification: string | null;
}

type UserAction =
  | { type: 'FETCH_SUCCESS'; payload: User[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: number }
  | { type: 'CLEAR_NOTIFICATION' };

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return { ...state, users: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload], notification: 'User added successfully' };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(user => user.id !== action.payload), notification: 'User deleted successfully' };
    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null };
    default:
      return state;
  }
};

const UserDashboard: React.FC = () => {
  const [state, dispatch] = useReducer(userReducer, { users: [], loading: true, error: null, notification: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const notificationTimeoutRef = useRef<number | null>(null);
  const newUserRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data: User[] = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: (error as Error).message });
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return state.users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [state.users, searchQuery]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    if (state.notification) {
      notificationTimeoutRef.current = window.setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 3000);
    }
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [state.notification]);

  useLayoutEffect(() => {
    if (newUserRef.current) {
      newUserRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [paginatedUsers]);

  const handleAddUser = useCallback(async (newUser: User) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        dispatch({ type: 'ADD_USER', payload: newUser });
        setCurrentPage(totalPages); // Navigate to the last page after adding a user
      }
    } catch (error) {
      console.error(error);
    }
  }, [totalPages]);

  const handleDeleteUser = useCallback(async (userId: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        dispatch({ type: 'DELETE_USER', payload: userId });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>

      <input
        type="text"
        placeholder="Search users by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md"
      />

      <UserForm onSubmit={handleAddUser} />

      <button
        onClick={() => dispatch({ type: 'FETCH_SUCCESS', payload: state.users })}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        disabled={state.loading}
      >
        Refresh Users
      </button>

      {state.notification && <Notification message={state.notification} onClose={() => dispatch({ type: 'CLEAR_NOTIFICATION' })} />}
      {state.loading && <p className="text-blue-500">Loading...</p>}
      {state.error && <p className="text-red-500">Error: {state.error}</p>}

      <ul className="divide-y divide-gray-300">
        {paginatedUsers.map((user, index) => (
          <li
            key={user.id}
            className="py-2 flex justify-between items-center"
            ref={index === paginatedUsers.length - 1 ? newUserRef : null}
          >
            <div>
              <p className="text-lg font-semibold text-gray-700">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
