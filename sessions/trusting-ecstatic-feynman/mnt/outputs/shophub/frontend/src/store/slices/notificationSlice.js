import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], unreadCount: 0 },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const n = state.items.find(i => i.id === action.payload);
      if (n && !n.is_read) { n.is_read = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
    },
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(n => !n.is_read).length;
    }
  }
});

export const { addNotification, markAsRead, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
