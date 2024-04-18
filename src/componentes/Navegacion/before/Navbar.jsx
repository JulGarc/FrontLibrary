import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Navbar = () => {
  return (
    
      <nav className="navbar navbar-expand-lg navbar-dark bg-black">   
        <div className="container-fluid">
        <i className="fa-solid fa-book-open-reader" style={{color: "white"}}></i>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button> 
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/Inicio" style={{ color: "white" }}>Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Iniciarsesion" style={{ color: "white" }}>Iniciar Sesion</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Registrarse" style={{ color: "white" }}>Registrarse</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Libros" style={{ color: "white" }}>Libros</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
   
  );
};

export default Navbar;
