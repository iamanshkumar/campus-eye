import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Check, Info, AlertTriangle, CheckCircle, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

const Notifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/api/notifications/me');
      setNotifications(data.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put(`/api/notifications/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All caught up!");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="text-emerald-500" size={20} />;
      case 'error': return <AlertTriangle className="text-red-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[400px]">
      <div className="p-3 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
        <h3 className="font-bold text-emerald-900">Notifications</h3>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>
      
      <div className="overflow-y-auto flex-1 p-2">
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((notif) => (
              <div 
                key={notif._id} 
                className={`p-3 rounded-lg flex gap-3 items-start transition-colors ${notif.isRead ? 'bg-gray-50/50 opacity-70' : 'bg-emerald-50/30 border border-emerald-100/50'}`}
                onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
              >
                <div className="mt-0.5">{getIcon(notif.type)}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
