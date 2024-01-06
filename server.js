const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Sử dụng một đối tượng để lưu trữ danh sách người dùng và tên của họ
const users = {};

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('Vừa có người kết nối!');

  // Xử lý sự kiện khi người dùng gửi tin nhắn
  socket.on('chat message', (data) => {
    const { message, username } = data;
    const time = new Date().toLocaleTimeString(); // Lấy thời gian hiện tại

    // Gửi tin nhắn tới tất cả người dùng đang kết nối
    io.emit('chat message', {
      message,
      username,
      time,
    });
  });

  // Xử lý sự kiện khi người dùng đăng nhập
  socket.on('new user', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('Có người đã kết nối:', username);
  });

  // Xử lý sự kiện khi người dùng ngắt kết nối
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit('Có người đã ngắt kết nối:', username);

  });

  
});

server.listen(3000, () => {
  console.log('Máy chủ đang chạy ở http://localhost:3000');
});

io.on('connection', (socket) => {
  console.log('Vừa có người dùng kết nối');
 // Xử lý sự kiện khi người dùng gửi tin nhắn
 socket.on('chat message', (data) => {
  const { message, username } = data;
  const time = new Date().toLocaleString(); // Lấy thời gian hiện tại (bao gồm ngày, giờ và phút)

  // Gửi tin nhắn tới tất cả người dùng đang kết nối
  io.emit('chat message', {
    message,
    username,
    time,
  });
});

//... (các phần xử lý sự kiện khác ở đây giữ nguyên)
});

