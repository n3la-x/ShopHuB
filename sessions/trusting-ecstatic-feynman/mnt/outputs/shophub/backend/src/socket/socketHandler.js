const jwt = require('jsonwebtoken');

const socketHandler = (io) => {
  // Authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User ${socket.user.id} connected`);

    // Join user's personal room for notifications
    socket.join(`user_${socket.user.id}`);

    // Join chat room
    socket.on('join_room', (room) => {
      socket.join(room);
      socket.to(room).emit('user_joined', { userId: socket.user.id });
    });

    // Handle chat messages
    socket.on('send_message', (data) => {
      const { room, message } = data;
      io.to(room).emit('new_message', {
        userId: socket.user.id,
        message,
        timestamp: new Date()
      });
    });

    // Handle notifications
    socket.on('mark_notification_read', async ({ notificationId }) => {
      try {
        const { Notification } = require('../models');
        await Notification.update({ is_read: true }, { where: { id: notificationId, user_id: socket.user.id } });
        socket.emit('notification_marked_read', { notificationId });
      } catch (err) {
        socket.emit('error', { message: 'Failed to mark notification' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User ${socket.user.id} disconnected`);
    });
  });
};

module.exports = socketHandler;
