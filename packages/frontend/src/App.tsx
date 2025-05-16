import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Header from './components/Header';
import Home from './pages/Home';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import CreateAccount from './pages/CreateAccount';

import auth, { LoggedUser } from './services/auth';

function App() {
  // current logged-in user (null when not logged in)
  const [user, setUser] = useState<LoggedUser | null>(null);
  // flag: finished the initial /api/me check
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

  /* ── run once on mount – ask server “Who am I?” ─────────── */
  useEffect(() => {
    auth
      .whoAmI()
      .then(setUser)         
      .catch(() => setUser(null))
      .finally(() => setChecked(true));
  }, []);

  /* logout handler passed to Header */
  const handleLogout = async () => {
    await auth.logout();     
    setUser(null);           
    navigate('/home');      
  };

  /* wait until /api/me returns before rendering */
  if (!checked) return null;

  return (
    <Box>
      <Header user={user} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/createAccount"
          element={<CreateAccount />}
        />
        <Route
          path="/home"
          element={<Home user={user} setUser={setUser} />}
        />
        <Route
          path="/forum"
          element={<Forum user={user} />}
        />
        <Route
          path="/profile"
          element={<Profile user={user} />}
        />
        {/* fall-back route */}
        <Route
          path="*"
          element={<Home user={user} setUser={setUser} />}
        />
      </Routes>
    </Box>
  );
}

export default App;
