import React from 'react';
import Districts from "./Districts";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./Home";
import SuburbDetail from "./SuburbDetail";

export const EndPointContext = React.createContext()

function App() {
    const URLEnd = "http://172.26.129.132:5000"

    // const URLEnd = "http://localhost:5000"

  return (
    <div className="app">
      <BrowserRouter>
          <EndPointContext.Provider value={URLEnd}>
              <Routes>
                  <Route path='/' element={<Home/>} />
                  <Route path='suburb/:id' element={<SuburbDetail/>}/>
              </Routes>
          </EndPointContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
