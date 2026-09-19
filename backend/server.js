require("dotenv").config();

const prisma = require("./src/lib/prisma");

const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

// Create HTTP server using existing Express app
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


app.set("io", io);

// Socket.IO authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET,
  {
    algorithms: ["HS256"],
  }
);

if (!decoded.userId || !decoded.role) {
  return next(new Error("Invalid authentication token"));
}

    socket.user = decoded;

    next();
  } catch (error) {
    return next(new Error("Invalid or expired token"));
  }
});

// Socket connection
io.on("connection", (socket) => {
  console.log(
    "Socket connected:",
    socket.id,
    "User:",
    socket.user.userId,
    "Role:",
    socket.user.role
  );

  // Join order room
  socket.on("join-order", async (orderId, callback) => {
    try {
      if (!orderId) {
        return callback?.({
          success: false,
          message: "Order ID is required",
        });
      }

      const userId = socket.user.userId;
      const role = socket.user.role;

      let authorized = false;

      // Customer can join only their own order
      if (role === "CUSTOMER") {
        const order = await prisma.order.findFirst({
          where: {
            id: orderId,
            customerId: userId,
          },
          select: {
            id: true,
          },
        });

        authorized = !!order;
      }

      // Rider can join only an order assigned to them
      if (role === "RIDER") {
        const delivery = await prisma.delivery.findFirst({
          where: {
            orderId,
            rider: {
              userId,
            },
          },
          select: {
            id: true,
          },
        });

        authorized = !!delivery;
      }

      if (!authorized) {
        return callback?.({
          success: false,
          message: "You are not authorized to join this order",
        });
      }

      const room = `order:${orderId}`;

      socket.join(room);

      console.log(
        `User ${userId} joined order room: ${room}`
      );

      return callback?.({
        success: true,
        message: "Joined order room successfully",
        room,
      });
    } catch (error) {
      console.error("Join order room error:", error);

      return callback?.({
        success: false,
        message: "Failed to join order room",
      });
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});