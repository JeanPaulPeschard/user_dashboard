// src/components/Notification.tsx
import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-blue-500 text-white p-3 rounded-md shadow-md">
      {message}
    </div>
  );
};

export default Notification;
