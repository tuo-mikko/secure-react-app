import React from 'react';
import { Route, Routes } from 'react-router-dom';

//import Login from './pages/Login';
import Home from './pages/Home';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import CreateAccount from './pages/CreateAccount';
import Header from './components/Header';

import { Box } from '@chakra-ui/react'

function App() {
  return (
      <Box>
        <Header></Header>
        <Routes>
          <Route
            path='/createAccount'
            element={
              <CreateAccount />
            }  
          />
          <Route
            path='/home'
            element={
              <Home />
            }  
          />
          <Route
            path='/forum'
            element={
              <Forum />
            }  
          />
          <Route
            path='/profile'
            element={
              <Profile />
            }  
          />
        </Routes>
      </Box>
  );
}

export default App;
