import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { 
  LoginPage, 
  RegisterPage, 
  Dashboard, 
  LevelSelection, 
  GuidePage,
  GamePlay
} from './pages';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
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
            
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
