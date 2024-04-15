// routes.js
import React from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import Navbar from "./Navbar";

import Iniciarsesion from "../Iniciarsesion";
import Registrarse from "../Registrarse";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/" />} />
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
