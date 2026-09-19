const { io } = require("socket.io-client");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNzZiZmJjNy02YTY3LTQxYjItOGM0Yi0yYmMyMDRmMTQ0MTkiLCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3ODkzNjAyMzEsImV4cCI6MTc4OTk2NTAzMX0.7ZnSQ3i8t48B9NI_oBsLb-MCJRSWpcePodVbh476xlU";

const orderId = "6f110e52-f436-4031-b1b4-f38bd5d00043";

const socket = io("http://localhost:5000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("Customer Socket Connected");
  console.log("Socket ID:", socket.id);

  socket.emit("join-order", orderId, (response) => {
    console.log("Join order response:", response);
  });
});

// 🔥 Rider ki live location receive karna
socket.on("rider-location", (data) => {
  console.log("LIVE RIDER LOCATION:", data);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

socket.on("disconnect", () => {
  console.log("Customer Socket Disconnected");
});