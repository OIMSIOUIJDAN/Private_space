import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './components/AuthProvider';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Album from './pages/Album';
import JarOfLove from './pages/JarOfLove';
import Login from './pages/Login';
import Navigation from './components/Navigation';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-4">
            <svg className="w-12 h-12 text-navy" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <p className="text-text-muted text-sm font-serif italic">Loading our space...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const isChat = location.pathname === '/chat';
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-cream">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/album" element={<ProtectedRoute><Album /></ProtectedRoute>} />
          <Route path="/jar" element={<ProtectedRoute><JarOfLove /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
      {!isChat && !isLogin && <Navigation />}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
}
