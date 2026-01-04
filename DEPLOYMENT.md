# Deploying Kolka to Vercel

This monorepo contains a frontend (`apps/web`) and a backend (`apps/api`). You can deploy both to Vercel.

## 1. Database Setup
Before deploying, ensure you have a PostgreSQL database accessible from the internet (e.g., Neon, Supabase, or Railway).

1. Get your Database Connection String (`DATABASE_URL`).
2. Run migrations locally or in your CI/CD:
   ```bash
   cd apps/api
   npm run db:push
   ```

## 2. Deploying Backend (`apps/api`)

1. Go to your Vercel Dashboard and click **Add New -> Project**.
2. Import your repository.
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `apps/api` (Click Edit)
   - **Build Command**: `npm run build` or `tsc`
   - **Output Directory**: `dist` (or leave default if not using it for static files)
     > *Note: For serverless functions, Vercel uses the `api` folder entry point we created.*
   - **Environment Variables**:
     - `DATABASE_URL`: Your production database URL.
     - `node_env`: `production`
     - `BETTER_AUTH_SECRET`: Random string for auth.
     - `BETTER_AUTH_URL`: Your Vercel domain (e.g. `https://your-api.vercel.app`)
     - `FRONTEND_URL`: Your frontend Vercel domain (e.g. `https://your-frontend.vercel.app`)

4. Click **Deploy**.

## 3. Deploying Frontend (`apps/web`)

1. Go to Vercel Dashboard -> **Add New -> Project**.
2. Import the SAME repository.
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web` (Click Edit)
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: Your deployed Backend URL (e.g. `https://your-api.vercel.app/api`)
     
4. Click **Deploy**.

## 4. Final Configuration

1. Update the **Backend** environment variables with the actual **Frontend** URL if you guessed it wrong.
2. Update the **Frontend** environment variables with the actual **Backend** URL if you guessed it wrong.
3. Redeploy if necessary.
