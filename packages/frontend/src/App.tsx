import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Header from './components/Header';
import Home from './pages/Home';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import CreateAccount from './pages/CreateAccount';

import auth, { LoggedUser } from './services/auth';

function App() {
  // store the logged‐in user
  const [user, setUser] = useState<LoggedUser | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.logout();    
    setUser(null);       
    navigate('/home');     
  };

  return (
    <Box>
      <Header user={user} onLogout={handleLogout} />

      <Routes>
        <Route
          path='/createAccount'
          element={<CreateAccount />}
        />
        <Route
          path='/home'
          element={
            <Home user={user} setUser={setUser} />
          }
        />
        <Route
          path="/forum"
          element={<Forum user={user} />}
        />
        <Route
          path='/profile'
          element={<Profile user={user} />}
        />
      </Routes>
    </Box>
  );
}

export default App;
