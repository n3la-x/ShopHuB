import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import { addNotification } from '../store/slices/notificationSlice';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (isAuthenticated && token) {
      socketRef.current = connectSocket(token);
      const s = socketRef.current;

      s.on('new_message', (data) => {
        dispatch(addNotification({ id: Date.now(), title: 'New Message', message: data.message, is_read: false }));
        toast('💬 New message received');
      });

      s.on('order_status_updated', ({ orderId, status }) => {
        dispatch(addNotification({
          id: Date.now(), type: 'order',
          title: 'Order Updated', message: `Order #${orderId} is now ${status}`, is_read: false
        }));
        toast.success(`Order status: ${status}`);
      });
    } else {
      disconnectSocket();
    }

    return () => { /* keep alive between rerenders */ };
  }, [isAuthenticated, dispatch]);

  return getSocket();
};
