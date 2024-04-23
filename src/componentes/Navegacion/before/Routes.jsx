import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Inicio from "../../Inicio";
import Iniciarsesion from "../../Iniciarsesion";
import Registrarse from "../../Registrarse";
import Libros from "../../Libros";
import Crearlibro from "../../Crearlibro";
import Usuarios from "../../Usuarios";
import Reservaciones from "../../Reservaciones";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Inicio" />} />
      <Route path="/Inicio" element={<Inicio />} />
      <Route path="/Iniciarsesion" element={<Iniciarsesion />} />
      <Route path="/Registrarse" element={<Registrarse />} />
      <Route path="/Libros" element={<Libros/>}/>
      <Route path="/Libro/crear" element={<Crearlibro/>}/>
      <Route path="/Usuarios" element={<Usuarios/>}/>
      <Route path="/Reservaciones" element={<Reservaciones/>}/>
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
