import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Inicio from "../Inicio";
import Iniciarsesion from "../Iniciarsesion";
import Registrarse from "../Registrarse";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirige a la página de inicio al cargar la aplicación */}
      <Route path="/" element={<Navigate to="/Inicio" />} />
      <Route path="/Inicio" element={<Inicio />} />
      <Route path="/Iniciarsesion" element={<Iniciarsesion />} />
      <Route path="/Registrarse" element={<Registrarse />} />
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
