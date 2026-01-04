import { env } from "./config/env.js";
import app from "./app.js";

// Start server
app.listen(env.PORT, () => {
  console.log(`
  🚀 KOLKA API Server
  ==================
  Environment: ${env.NODE_ENV}
  Port: ${env.PORT}
  Frontend: ${env.FRONTEND_URL}
  
  Available endpoints:
  - POST /api/auth/register
  - POST /api/auth/login
  - GET  /api/auth/me
  - GET  /api/health
  - GET  /api/users/me
  - GET  /api/levels
  - GET  /api/progress
  - GET  /api/leaderboard
  `);
});
