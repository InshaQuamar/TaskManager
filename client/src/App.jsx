import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Profile from './pages/Profile';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><AuthPage /></PublicRoute>} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects"  element={<Projects />} />
            <Route path="tasks"     element={<Tasks />} />
            <Route path="team"      element={<Team />} />
            <Route path="profile"   element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
