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

## 2. Database Management (Migrations & Seeding)

Since Vercel functions are serverless and ephemeral, you should run administrative database commands **locally** from your machine, pointing to the production database.

### Running Migrations
To push your schema changes to the production database:

1. Create a `.env.production` file in `apps/api` with your production `DATABASE_URL`.
2. Run the command using that env file:
   ```bash
   # Option A: Using the specific command
   cd apps/api
   DATABASE_URL="postgresql://user:pass@host/db" npm run db:push

   # Option B: If you have .env.production
   cd apps/api
   npm run db:push -- --config=drizzle.config.ts
   ```
   *(Note: Ensure your local environment variables use the production URL when running this)*

### Running Seeds `npm run db:seed`
To seed the production database:

1. Ensure your `DATABASE_URL` environment variable is set to the **Production URL**.
2. Run the seed command:
   ```bash
   cd apps/api
   DATABASE_URL="postgresql://user:pass@host/db" npm run db:seed
   ```

## 3. Deploying Backend (`apps/api`)

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
     - `FRONTEND_URL`: Your frontend Vercel domain (e.g. `https://your-frontend.vercel.app`) - **IMPORTANT**: No trailing slash!

> [!IMPORTANT]
> **CORS Errors**: If you see CORS errors:
> 1. Ensure `FRONTEND_URL` in your **Backend Project Settings** matches your frontend URL exactly (no trailing slash).
> 2. Ensure `VITE_API_URL` in your **Frontend Project Settings** matches your backend URL exactly (no trailing slash).


4. Click **Deploy**.

## 3. Deploying Frontend (`apps/web`)

1. Go to Vercel Dashboard -> **Add New -> Project**.
2. Import the SAME repository.
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web` (Click Edit)
   - **Environment Variables**:
     - `VITE_API_URL`: Your deployed Backend URL (e.g. `https://your-api.vercel.app`)
     
4. Click **Deploy**.

## 4. Final Configuration

1. Update the **Backend** environment variables with the actual **Frontend** URL if you guessed it wrong.
2. Update the **Frontend** environment variables with the actual **Backend** URL if you guessed it wrong.
3. Redeploy if necessary.
