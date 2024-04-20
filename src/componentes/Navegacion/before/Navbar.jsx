import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useAuth } from "../../Contextos/AuthContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const  { token } = useAuth()
  const { logout } = useAuth()
  const {decodeToken} = useAuth()
  const tokenData = decodeToken(token)
  const [showNavMenu, setShowNavMenu] = useState(false)
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setShowNavMenu(true)
  }

  const handleMouseLeave = () => {
    setShowNavMenu(false)
  }

  const cerrarSesion = () => {
    logout()
  }
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

              {
                !token ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="/Iniciarsesion" style={{ color: "white" }}>Iniciar Sesion</Link>
                  </li>
                ) : (null)
              }

              {
                !token ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="/Registrarse" style={{ color: "white" }}>Registrarse</Link>
                  </li>
                ) : (null)
              }

              {
                token && tokenData.auth_role_id == 1 ? (
                  <li className="nav-item" style={{ position: "relative", display: "inline-block" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <Link className="nav-link" to="/Libros" style={{ textDecoration: "none", color: "white"}}>
                      Libros
                    </Link>
                    {showNavMenu && (
                      <div className="dropdown-menu" style={{ left: 0, backgroundColor: "#000000", padding: "10px", display: "block" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Link to="/Libro/crear" className="dropdown-link" style={{ display: "block", color: "white", textDecoration: "none", padding: "5px 0" }}>Crear Libro</Link>
                      </div>
                    )}
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/Libros" style={{ color: "white" }}>Libros</Link>
                  </li>
                )
              }

              {
                token && tokenData.auth_role_id == 1 ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="/Usuarios" style={{ color: "white" }}>Usuarios</Link>
                  </li>
                ) : (null)
              }

              {
                token ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="/Iniciarsesion" onClick={cerrarSesion} style={{ color: "white" }}>Cerrar sesión</Link>
                  </li>                  
                ) : (null)
              }
            </ul>
          </div>
        </div>
      </nav>
   
  );
};

export default Navbar;
