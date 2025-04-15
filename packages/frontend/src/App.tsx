import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Header from './components/Header';

import { Box } from '@chakra-ui/react'

function App() {
  return (
      <Box>
        <Header></Header>
        <Routes>
          <Route
            path='/login'
            element={
              <Login />
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
