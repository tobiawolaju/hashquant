import { createPublicClient, erc20Abi, formatUnits, http } from 'viem';
const monad = { id: 10143, name: 'Monad Testnet', nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 }, rpcUrls: { default: { http: ['https://testnet-rpc.monad.xyz'] } } } as const;
export const client = createPublicClient({ chain: monad as any, transport: http('https://testnet-rpc.monad.xyz') });
export async function getNativeBalance(address: `0x${string}`) { const b = await client.getBalance({ address }); return Number(formatUnits(b, 18)); }
export async function getErc20Balance(owner: `0x${string}`, token: `0x${string}`, decimals = 18) { const bal = await client.readContract({ address: token, abi: erc20Abi, functionName: 'balanceOf', args: [owner] }); return Number(formatUnits(bal, decimals)); }
