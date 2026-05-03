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

## Deploying to Render

1. Push repository changes to your Git provider.
2. In Render, create a **New Web Service** and connect the repository.
3. Configure service settings:
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add backend environment variables in Render dashboard:
   - `PORT` (Render can inject this automatically)
   - `DATABASE_URL`
   - `REDIS_URL`
   - `PRIVY_VERIFICATION_KEY`
   - `MONAD_RPC_URL`
5. Deploy and verify health/API routes.

### Recommended Render Settings

- Use the same Node.js major version locally and on Render.
- Enable auto-deploy from your main branch.
- If you use private networking/databases, ensure inbound rules allow Render service access.
