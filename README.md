<p align="center">
  <h1 align="center">🎮 KOLKA</h1>
  <p align="center">
    <strong>Indonesian Grammar Learning Game for Deaf Children</strong>
  </p>
  <p align="center">
    An interactive educational game that teaches SPOK sentence structure through drag-and-drop gameplay
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Express-4.21.0-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeScript-5.7.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
</p>

---

## 📖 About

**KOLKA** (Kalimat Olah Kata) is an educational game designed specifically for deaf children learning Indonesian sentence structure. The app teaches **SPOK** (Subjek, Predikat, Objek, Keterangan) - the fundamental components of Indonesian grammar through an engaging drag-and-drop interface.

| Component | Meaning | Question | Example |
|-----------|---------|----------|---------|
| **S** (Subjek) | Subject | Who? | 👤 Ani |
| **P** (Predikat) | Predicate | What action? | 🏃 membeli |
| **O** (Objek) | Object | What's affected? | 📦 buku |
| **K** (Keterangan) | Adverb | Where/When? | 📍 di toko |

> **Example:** *"Ani membeli buku di toko"* (Ani buys a book at the store)

---

## ✨ Features

- 🎯 **Interactive Learning** - Drag-and-drop mechanics to build sentences visually.
- 🏆 **Progressive Levels** - 4 levels focusing on each SPOK component (S, P, O, K).
- ⭐ **Performance Ratings** - Earn up to 3 stars per level based on accuracy.
- 📊 **Dynamic Dashboard** - Detailed stats including total XP, stars, and completion history.
- 🏅 **Global Leaderboard** - Compete with other learners in weekly and global rankings.
- 🎉 **Visual Feedback** - Confetti celebrations and animations to reward progress.
- 🔐 **Secure Auth** - Custom JWT-based authentication with bcrypt password hashing.
- 📱 **Responsive UI** - Optimized for both desktop and tablet experiences.

---

## 🛠️ Tech Stack

### Monorepo Structure
- **npm Workspaces** for managing `apps/` and `packages/`

### Frontend ([apps/web](file:///Users/rizkimaulanasidik/Developer/Me/Proj/Kolka/apps/web))
- **React 19** & **Vite**
- **React Router 7** for navigation
- **dnd-kit** for drag-and-drop functionality
- **Framer Motion** for premium animations
- **CSS Modules** for component-scoped styling
- **Canvas Confetti** for rewards

### Backend ([apps/api](file:///Users/rizkimaulanasidik/Developer/Me/Proj/Kolka/apps/api))
- **Express.js** with **TypeScript**
- **Drizzle ORM** for type-safe database access
- **PostgreSQL** database
- **JWT + bcrypt** for custom authentication
- **Zod** for request validation

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **Postgres** (locally or via [Neon](https://neon.tech/))

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/kolka.git
   cd kolka
   npm install
   ```

2. **Environment Setup**
   Create `.env` in `apps/api`:
   ```env
   DATABASE_URL=postgresql://user:pass@localhost:5432/kolka
   JWT_SECRET=your-random-secret
   FRONTEND_URL=http://localhost:5173
   ```

3. **Database Initialization**
   ```bash
   cd apps/api
   npm run db:push    # Sync schema
   npm run db:seed    # Load levels & questions
   
   # Optional Database Tools
   npm run db:studio  # Open Drizzle GUI to view data
   npm run db:generate # Generate migration files
   ```

4. **Run Development**
   ```bash
   # From root directory
   npm run dev
   ```
   *Frontend: `http://localhost:5173` | Backend: `http://localhost:3001`*

---

## 📁 Project Structure

```text
kolka/
├── apps/
│   ├── web/                 # React Frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI (Common, Game, Layout)
│   │   │   ├── context/     # Auth, Game, & Toast providers
│   │   │   ├── pages/       # View components (Dashboard, GamePlay, etc.)
│   │   │   ├── services/    # API abstraction layer
│   │   │   └── styles/      # Design system & global styles
│   │
│   └── api/                 # Express Backend
│       ├── src/
│       │   ├── db/          # Schema, Migrations, & Seeds
│       │   ├── lib/         # JWT and Auth utilities
│       │   ├── routes/      # Express route controllers
│       │   ├── services/    # Business logic layer
│       │   └── middleware/  # Error & Auth handling
│
├── packages/                # Shared utilities (future)
└── package.json             # Root workspace config
```

---

## 🔌 API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Sign in & receive JWT |
| `GET`  | `/api/auth/me` | Verify token & get session |
| `GET`  | `/api/users/me` | Current user profile & progress |
| `GET`  | `/api/levels` | List of game levels |
| `GET`  | `/api/levels/:slug/questions` | Level-specific questions |
| `POST` | `/api/progress/levels/:id/complete` | Submit level results |
| `GET`  | `/api/leaderboard` | Global player rankings |

---

## 🎮 How to Play

1. **Register/Login** - Create an account or sign in
2. **View Dashboard** - See your progress and stats
3. **Select a Level** - Choose from 4 SPOK levels
4. **Read the Guide** - Learn about sentence structure
5. **Play the Game** - Drag the correct word to complete sentences
6. **Earn Stars** - Get rated based on your accuracy
7. **Check Leaderboard** - Compare with other players

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments
- Built with ❤️ for the deaf community.
- Inspired by modern gamification in language learning.
