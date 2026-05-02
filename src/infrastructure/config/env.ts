import 'dotenv/config';

export interface EnvConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  redisUrl: string;
  privyVerificationKey: string;
  monadRpcUrl: string;
}

export const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8080),
  databaseUrl: process.env.DATABASE_URL ?? '',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  privyVerificationKey: process.env.PRIVY_VERIFICATION_KEY ?? 'dev-secret',
  monadRpcUrl: process.env.MONAD_RPC_URL ?? 'https://testnet-rpc.monad.xyz'
};
