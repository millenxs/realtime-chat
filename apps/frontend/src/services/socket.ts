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
          console.log("Conectado ao WebSocket");
          resolve(this.socket!);
        });
        
        this.socket.on("connect_error", (error) => {
          console.error("Erro de conexão com WebSocket:", error);
          reject(error);
        });
        
        // Configurando handler de mensagens
        if (this.messageHandler) {
          this.socket.on("message", this.messageHandler);
        }
      } catch (error) {
        console.error("Erro ao conectar ao WebSocket:", error);
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
      // Remove o handler antigo para evitar duplicação
      this.socket.off("message");
      // Adiciona o novo handler
      this.socket.on("message", callback);
    }
  }

  sendMessage(message: Partial<Message>) {
    if (!this.socket) {
      console.error("Socket não conectado");
      return false;
    }
    
    this.socket.emit("message", message);
    return true;
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

// Singleton para o serviço de socket
export const socketService = new SocketService();