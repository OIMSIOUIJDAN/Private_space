import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Album from './pages/Album';
import JarOfLove from './pages/JarOfLove';
import Navigation from './components/Navigation';

function AppContent() {
  const location = useLocation();
  const isChat = location.pathname === '/chat';

  return (
    <div className="min-h-screen bg-navy">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/album" element={<Album />} />
          <Route path="/jar" element={<JarOfLove />} />
        </Routes>
      </AnimatePresence>
      {!isChat && <Navigation />}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
