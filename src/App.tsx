import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import ChapterPage from './pages/ChapterPage';
import ExercisePage from './pages/ExercisePage';

// ────────────────────────────────────────────
// Page transition variants (shared)
// ────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween' as const,
  duration: 0.3,
};

// ────────────────────────────────────────────
// RefugePage — placeholder
// ────────────────────────────────────────────

function RefugePage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-6 p-6"
      style={{
        background: 'linear-gradient(180deg, var(--color-river-800) 0%, var(--color-river-400) 100%)',
      }}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <span className="text-5xl">&#x1F3E0;</span>
      <h1 className="text-3xl font-bold text-white font-display">
        El Refugio
      </h1>
      <p className="text-white/70 text-lg">Coleccion de animales rescatados</p>
      <p className="text-white/50 text-sm text-center max-w-xs">
        Aqui podras ver todos los animales que has ayudado en tu aventura por el bosque de Chiloe.
      </p>
      <button
        className="game-button bg-white/20 backdrop-blur-sm text-white py-3 px-6"
        onClick={() => navigate('/')}
      >
        Volver al Bosque
      </button>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// ParentDashboardPage — placeholder
// ────────────────────────────────────────────

function ParentDashboardPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-6 p-6"
      style={{
        background: 'linear-gradient(180deg, var(--color-earth-800) 0%, var(--color-earth-500) 100%)',
      }}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <span className="text-5xl">&#x1F512;</span>
      <h1 className="text-3xl font-bold text-white font-display">
        Panel Parental
      </h1>
      <p className="text-white/70 text-lg">Protegido con PIN</p>
      <p className="text-white/50 text-sm text-center max-w-xs">
        Aqui ira el ingreso de PIN y las estadisticas de progreso de tu hijo/a.
      </p>
      <button
        className="game-button bg-white/20 backdrop-blur-sm text-white py-3 px-6"
        onClick={() => navigate('/')}
      >
        Volver al Bosque
      </button>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// Animated routes wrapper
// ────────────────────────────────────────────

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapter/:chapterId" element={<ChapterPage />} />
        <Route path="/exercise/:chapterId" element={<ExercisePage />} />
        <Route path="/refuge" element={<RefugePage />} />
        <Route path="/parent" element={<ParentDashboardPage />} />
      </Routes>
    </AnimatePresence>
  );
}

// ────────────────────────────────────────────
// App root
// ────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
