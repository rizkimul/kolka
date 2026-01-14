import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common';
import { 
  LoginPage, 
  RegisterPage, 
  Dashboard, 
  LevelSelection, 
  GuidePage,
  GamePlay,
  Leaderboard,
  BermainMenu,
  MelengkapiKalimat,
  MenyusunKalimat,
  KamusPage
} from './pages';

// Loading Spinner
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-4 animate-bounce">🎮</div>
      <p className="text-gray-700 font-semibold">Memuat KOLKA...</p>
    </div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

// Public Route - redirect if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <GameProvider>
          <BrowserRouter>
            <Routes>
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/level-selection" 
                element={
                  <ProtectedRoute>
                    <LevelSelection />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/bermain" 
                element={
                  <ProtectedRoute>
                    <BermainMenu />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/game/melengkapi" 
                element={
                  <ProtectedRoute>
                    <MelengkapiKalimat />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/game/menyusun" 
                element={
                  <ProtectedRoute>
                    <MenyusunKalimat />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/game/:levelId" 
                element={
                  <ProtectedRoute>
                    <GamePlay />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/kamus" 
                element={
                  <ProtectedRoute>
                    <KamusPage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/guide" 
                element={
                  <ProtectedRoute>
                    <GuidePage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/leaderboard" 
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </GameProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
