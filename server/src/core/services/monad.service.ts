import { createPublicClient, erc20Abi, formatUnits, http } from 'viem';
import { env } from '../../infrastructure/config/env.js';

const monad = { id: 10143, name: 'Monad Testnet', nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 }, rpcUrls: { default: { http: [env.monadRpcUrl] } } } as const;
export const monadClient = createPublicClient({ chain: monad as never, transport: http(env.monadRpcUrl) });

export async function getNativeBalance(address: `0x${string}`): Promise<number> {
  const balance = await monadClient.getBalance({ address });
  return Number(formatUnits(balance, 18));
}

export async function getErc20Balance(owner: `0x${string}`, token: `0x${string}`, decimals = 18): Promise<number> {
  const balance = await monadClient.readContract({ address: token, abi: erc20Abi, functionName: 'balanceOf', args: [owner] });
  return Number(formatUnits(balance, decimals));
}
