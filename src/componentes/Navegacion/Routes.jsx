// routes.js
import React from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import Navbar from "./Navbar";

import Iniciarsesion from "../Iniciarsesion";
import Registrarse from "../Registrarse";
import Libros from "../Libros";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/" />} />
      <Route path="/Iniciarsesion" element={<Iniciarsesion />} />
      <Route path="/Registrarse" element={<Registrarse />} />
      <Route path="/Libros" element={<Libros/>}/>
    </Routes>
  );
};

const RoutesConfig = () => {
  return (
    <div>
      <Navbar />
      <AppRoutes />
    </div>
  );
};

export default RoutesConfig;
