import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
export function createSocket(server:any){ const io=new Server(server,{path:'/ws',cors:{origin:'*'}}); io.use((socket,next)=>{try{const t=(socket.handshake.auth?.token||'').replace('Bearer ',''); const d:any=jwt.verify(t,process.env.PRIVY_VERIFICATION_KEY||'dev-secret'); socket.data.auth={userId:d.userId||d.sub,walletAddress:d.walletAddress||d.wallet?.address}; next();}catch{next(new Error('unauthorized'));}}); return io; }
