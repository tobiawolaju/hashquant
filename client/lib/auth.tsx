'use client';
import { createContext, useContext } from 'react';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';

const AuthCtx = createContext<{walletAddress: string | null; authenticated: boolean}>({ walletAddress: null, authenticated: false });

export function AppAuthProvider({children}:{children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ''}
      config={{
        embeddedWallets: { ethereum: { createOnLogin: 'users-without-wallets' } },
        appearance: { theme: 'dark' },
        loginMethods: ['email'],
      }}
    >
      <AuthStateProvider>{children}</AuthStateProvider>
    </PrivyProvider>
  );
}

function AuthStateProvider({children}:{children: React.ReactNode}) {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const evmWallet = wallets.find((w: any) => w.walletClientType === 'privy' && w.address?.startsWith('0x'));
  return <AuthCtx.Provider value={{ walletAddress: evmWallet?.address ?? null, authenticated: ready && authenticated }}>{children}</AuthCtx.Provider>;
}

export const useAuthState = () => useContext(AuthCtx);
