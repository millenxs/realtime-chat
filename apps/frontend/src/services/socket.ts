import io from "socket.io-client";
import { Socket } from "socket.io-client";
import { Message } from "@/types";

class SocketService {
  private socket: typeof Socket | null = null;
  private messageHandler: ((message: Message) => void) | null = null;

  connect(token: string): Promise<typeof Socket> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io("http://localhost:3333", { auth: { token } });
        
        this.socket.on("connect", () => {
          console.log("Connected to WebSocket");
          resolve(this.socket!);
        });
        
        this.socket.on("connect_error", (error) => {
          console.error("WebSocket connection error:", error);
          reject(error);
        });
        
        // Setting up message handler
        if (this.messageHandler) {
          this.socket.on("message", this.messageHandler);
        }
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onMessage(callback: (message: Message) => void) {
    this.messageHandler = callback;
    
    if (this.socket) {
      // Remove old handler to avoid duplication
      this.socket.off("message");
      // Add new handler
      this.socket.on("message", callback);
    }
  }

  sendMessage(message: Partial<Message>) {
    if (!this.socket) {
      console.error("Socket not connected");
      return false;
    }
    
    this.socket.emit("message", message);
    return true;
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

// Singleton for socket service
export const socketService = new SocketService();
