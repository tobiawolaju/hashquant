export type SocketChannel = 'ticker' | 'orderbook' | 'strategy_signals' | 'portfolio';

type Handler<T> = (payload: T) => void;

class SocketService {
  private ws: WebSocket | null = null;
  private handlers = new Map<SocketChannel, Set<Handler<any>>>();

  connect(url = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws') {
    if (this.ws) return;
    this.ws = new WebSocket(url);
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const channel = msg.channel as SocketChannel;
      this.handlers.get(channel)?.forEach((h) => h(msg.payload));
    };
    this.ws.onclose = () => { this.ws = null; };
  }

  subscribe<T>(channel: SocketChannel, handler: Handler<T>) {
    if (!this.handlers.has(channel)) this.handlers.set(channel, new Set());
    this.handlers.get(channel)!.add(handler as Handler<any>);
    this.ws?.send(JSON.stringify({ action: 'subscribe', channel }));
    return () => this.handlers.get(channel)?.delete(handler as Handler<any>);
  }
}

export const socketService = new SocketService();
