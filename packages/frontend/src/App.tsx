import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

//import Login from './pages/Login';
import Home from './pages/Home';

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

      <Routes>
        <Route
          path='/home'
          element={
            <Home />
          }  
        />
      </Routes>
  );
}

export default App;
