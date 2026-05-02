# Dominus Quant Backend

## Setup

1. Copy env template:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - run backend with hot reload
- `npm run build` - compile TypeScript
- `npm start` - run compiled server
- `npm run check` - type-check only

## Environment Variables

- `PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `PRIVY_VERIFICATION_KEY`
- `MONAD_RPC_URL`

## High-level Endpoints

- REST API routes are mounted from `src/api/routes`
- Socket server is configured in `src/api/sockets`
