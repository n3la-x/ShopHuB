import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead } from '../../store/slices/notificationSlice';
import { getSocket } from '../../services/socket';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector(s => s.notifications);

  const handleRead = (id) => {
    dispatch(markAsRead(id));
    const socket = getSocket();
    if (socket) socket.emit('mark_notification_read', { notificationId: id });
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative text-2xl">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b font-semibold text-gray-700">Notifications</div>
          {items.length === 0 ? (
            <p className="p-4 text-sm text-gray-400 text-center">No notifications</p>
          ) : items.slice(0, 10).map(n => (
            <div
              key={n.id}
              onClick={() => handleRead(n.id)}
              className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${!n.is_read ? 'bg-blue-50' : ''}`}
            >
              <p className="text-sm font-medium text-gray-800">{n.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
