import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../infrastructure/config/env.js';

export function createSocket(server: Parameters<typeof Server>[0]): Server {
  const io = new Server(server, { path: '/ws', cors: { origin: '*' } });
  io.use((socket, next) => {
    try {
      const token = String(socket.handshake.auth?.token ?? '').replace('Bearer ', '');
      const decoded = jwt.verify(token, env.privyVerificationKey) as Record<string, unknown>;
      const userId = (decoded.userId as string | undefined) || (decoded.sub as string | undefined);
      const walletAddress = (decoded.walletAddress as string | undefined) || ((decoded.wallet as { address?: string } | undefined)?.address);
      if (!userId || !walletAddress) return next(new Error('unauthorized'));
      socket.data.auth = { userId, walletAddress };
      return next();
    } catch {
      return next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const { userId, walletAddress } = socket.data.auth as { userId: string; walletAddress: string };
    socket.join(`user:${userId}`);
    socket.emit('portfolio', { walletAddress });
    socket.on('ticker', () => undefined);
    socket.on('orderbook', () => undefined);
    socket.on('strategy_signals', () => undefined);
    socket.on('portfolio', () => undefined);
  });

  return io;
}
