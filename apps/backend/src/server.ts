import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { setupWebSocket } from './config/websocket';
import http from 'http';
import messageRoutes from "./modules/messages/message.routes";
import cors from "cors";

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://frontend:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true, // se estiver usando cookies
  })
);

app.use(express.json());
app.use(routes);
app.use("/messages", messageRoutes);

const server = http.createServer(app);

setupWebSocket(server);


const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
