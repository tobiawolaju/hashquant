# Dominus Quant Frontend

Next.js frontend for Dominus Quant.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000`.

## Scripts

- `npm run dev` - run Next.js in development mode
- `npm run build` - production build
- `npm run start` - serve the production build
- `npm run lint` - run ESLint checks

## Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel, click **Add New Project** and import the repo.
3. Configure these settings:
   - **Root Directory**: `client`
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)
4. Add required environment variables from `.env` (for example: `NEXT_PUBLIC_*` variables).
5. Deploy and verify the production URL.

### Optional: Vercel CLI

```bash
npm i -g vercel
cd client
vercel
```

For production deployment:

```bash
vercel --prod
```
