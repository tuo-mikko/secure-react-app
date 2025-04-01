import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

//import Login from './pages/Login';
import Home from './pages/Home';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import Header from './components/Header';

import { Box } from '@chakra-ui/react'

function App() {
  return (
    //<div className="App">
    //  <header className="App-header">
     //   <p>
       //   Welcome to White Lotus forum xxx
        //</p>
       // <a
         // className="App-link"
         // href="https://github.com/tuo-mikko/secure-react-app"
          //target="_blank"
         // rel="noopener noreferrer"
        //>
          //Git repository
        //</a>
      //</header>
      <Box>
        <Header></Header>
        <Routes>
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
