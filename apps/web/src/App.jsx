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
  Leaderboard
} from './pages';

// Loading Spinner
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '1.2rem',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎮</div>
      <p>Memuat KOLKA...</p>
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
                path="/game/:levelId" 
                element={
                  <ProtectedRoute>
                    <GamePlay />
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
