import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoutesConfig from "./componentes/Navegacion/Routes";
import { AuthProvider } from "./componentes/Contextos/AuthContext";
import './App.css';

function App() {
  return (
    <div className="App">
    <AuthProvider>
      <Router>
        <RoutesConfig />  
      </Router>
    </AuthProvider>
    </div>
  );
}

export default App;
