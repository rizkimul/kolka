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

**KOLKA** (Kalimat Olah Kata) is an educational game designed specifically for deaf children learning Indonesian sentence structure. The app teaches **SPOK** (Subjek, Predikat, Objek, Keterangan) - the fundamental components of Indonesian grammar:

| Component | Meaning | Question | Example |
|-----------|---------|----------|---------|
| **S** (Subjek) | Subject | Who? | 👤 Ani |
| **P** (Predikat) | Predicate | What action? | 🏃 membeli |
| **O** (Objek) | Object | What's affected? | 📦 buku |
| **K** (Keterangan) | Adverb | Where/When? | 📍 di toko |

> **Example:** *"Ani membeli buku di toko"* (Ani buys a book at the store)

---

## ✨ Features

- 🎯 **Drag-and-Drop Gameplay** - Interactive learning through visual sentence building
- 🏆 **Level Progression** - 4 progressive levels focusing on each SPOK component
- ⭐ **Star Rating System** - Earn 0-3 stars based on performance
- 📊 **Progress Dashboard** - Track total score, XP, and completion statistics
- 🏅 **Leaderboard** - Compete with other learners
- 🎊 **Confetti Celebrations** - Rewarding feedback for correct answers
- 🔐 **User Authentication** - Secure login with Better Auth
- 📱 **Responsive Design** - Works on desktop and mobile devices

---

## 🛠️ Tech Stack

### Frontend (`apps/web`)
- **React 19** with Vite for fast development
- **React Router DOM** for navigation
- **@dnd-kit** for drag-and-drop functionality
- **Framer Motion** for smooth animations
- **Lucide React** for icons
- **Canvas Confetti** for celebration effects
- **CSS Modules** for scoped styling

### Backend (`apps/api`)
- **Express.js** REST API
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL
- **Better Auth** for authentication
- **Zod** for validation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** database
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kolka.git
   cd kolka
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env` file in `apps/api`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/kolka
   BETTER_AUTH_SECRET=your-secret-key
   FRONTEND_URL=http://localhost:5173
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   cd apps/api
   npm run db:push      # Push schema to database
   npm run db:seed      # Seed initial data
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev          # Starts frontend
   
   # In another terminal
   cd apps/api
   npm run dev          # Starts backend
   ```

6. **Open the app**
   
   Navigate to `http://localhost:5173` in your browser

---

## 📁 Project Structure

```
kolka/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── context/     # Auth & Game context providers
│   │   │   ├── pages/       # Page components
│   │   │   ├── services/    # API service layer
│   │   │   └── styles/      # Global styles
│   │   └── package.json
│   │
│   └── api/                 # Express backend
│       ├── src/
│       │   ├── config/      # Environment config
│       │   ├── db/          # Drizzle schema & migrations
│       │   ├── lib/         # Better Auth setup
│       │   ├── middleware/  # Express middleware
│       │   ├── routes/      # API routes
│       │   └── services/    # Business logic
│       └── package.json
│
├── packages/                # Shared packages (future)
└── package.json             # Monorepo root
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/sign-up/email` | Register new user |
| `POST` | `/api/auth/sign-in/email` | Login user |
| `POST` | `/api/auth/sign-out` | Logout user |
| `GET` | `/api/auth/session` | Get current session |
| `GET` | `/api/users/me` | Get current user profile |
| `GET` | `/api/levels` | Get all levels |
| `GET` | `/api/levels/:id/questions` | Get questions for a level |
| `GET` | `/api/progress` | Get user progress |
| `POST` | `/api/progress/complete-level` | Submit level completion |
| `GET` | `/api/leaderboard` | Get top players |

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Designed with ❤️ for deaf children learning Indonesian
- Built for educational purposes
- Inspired by gamification in language learning

---

<p align="center">
  Made with 💜 by the KOLKA Team
</p>
