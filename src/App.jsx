import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoutesConfig from "./componentes/Navegacion/before/Routes";


function App() {
  return (
    <div>
    <Router>
      <RoutesConfig />  
    </Router>
    </div>
  );
}

export default App;
