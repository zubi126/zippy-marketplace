// // const { io } = require("socket.io-client");

// // const socket = io("http://localhost:5000");

// // socket.on("connect", () => {
// //   console.log("Connected to Socket.IO server");
// //   console.log("Socket ID:", socket.id);

// //   socket.disconnect();
// // });

// // socket.on("connect_error", (error) => {
// //   console.error("Connection error:", error.message);
// // });

// // socket.on("disconnect", () => {
// //   console.log("Disconnected from Socket.IO server");
// // });











// const { io } = require("socket.io-client");

// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlNjYyYmI3YS0xN2Y1LTRmODQtOTAyYy05Nzc4Yjc1NzEzNWUiLCJyb2xlIjoiUklERVIiLCJpYXQiOjE3ODk1ODM3MjcsImV4cCI6MTc5MDE4ODUyN30.2hQft1H3zhL6Vq5Z87HxefEejjS8_e4SrSdf0vVP7k8";

// const socket = io("http://localhost:5000", {
//   auth: {
//     token,
//   },
// });

// socket.on("connect", () => {
//   console.log("Authenticated Socket Connected");
//   console.log("Socket ID:", socket.id);

//   socket.disconnect();
// });

// socket.on("connect_error", (error) => {
//   console.error("Connection error:", error.message);
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected");
// });























// const { io } = require("socket.io-client");

// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlNjYyYmI3YS0xN2Y1LTRmODQtOTAyYy05Nzc4Yjc1NzEzNWUiLCJyb2xlIjoiUklERVIiLCJpYXQiOjE3ODk1ODM3MjcsImV4cCI6MTc5MDE4ODUyN30.2hQft1H3zhL6Vq5Z87HxefEejjS8_e4SrSdf0vVP7k8";

// const orderId = "fca62d45-615b-4d3b-92d1-306d9eb3fb4f";

// const socket = io("http://localhost:5000", {
//   auth: {
//     token,
//   },
// });

// socket.on("connect", () => {
//   console.log("Authenticated Socket Connected");
//   console.log("Socket ID:", socket.id);

//   socket.emit("join-order", orderId, (response) => {
//     console.log("Join order response:", response);

//     socket.disconnect();
//   });
// });

// socket.on("connect_error", (error) => {
//   console.error("Connection error:", error.message);
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected");
// });














const { io } = require("socket.io-client");

// Yahan Test Rider 2 ka JWT token paste karo
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlY2U4M2FkZi0zN2QwLTRiNjItYTAyNi1hZTU3ZjZmMTc5NzYiLCJyb2xlIjoiUklERVIiLCJpYXQiOjE3ODk0NTAxNjMsImV4cCI6MTc5MDA1NDk2M30.QP8MVZNDEf7V1YemHrr0WUGMxlJj5nmHONH74Rhaza8";

const orderId = "6f110e52-f436-4031-b1b4-f38bd5d00043";

const socket = io("http://localhost:5000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("Rider Socket Connected");
  console.log("Socket ID:", socket.id);

  socket.emit("join-order", orderId, (response) => {
    console.log("Join order response:", response);
  });
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

socket.on("disconnect", () => {
  console.log("Rider Socket Disconnected");
});