import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoutesConfig from "./componentes/Navegacion/before/Routes";
import { AuthProvider } from "./componentes/Contextos/AuthContext";

function App() {
  return (
    <div>
    <AuthProvider>
      <Router>
        <RoutesConfig />  
      </Router>
    </AuthProvider>
    </div>
  );
}

export default App;
