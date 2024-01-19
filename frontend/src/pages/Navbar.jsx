import React from 'react'
import { Link } from "react-router-dom"; // react-router-dom para la navegación

function Navbar() {
  return (
    <div>
        {/* Navigation */}
      <nav
        className="navbar navbar-expand navbar-light bg-faded"
        style={{ height: "70px", backgroundColor: "#3badee" }}
      >
        <div className="container">
            {/* Ícono de inicio (home) */}
          <Link to="/" className="navbar-brand btn btn-outline-light">
            <i className="fa-solid fa-house"></i>
          </Link>
          {/* Botón Pacientes Pendientes */}
          <Link
            to="/pacientes/pendientes"
            className="navbar-brand btn btn-outline-light"
          >
            PACIENTES PENDIENTES
          </Link>

          {/* Resto de las opciones de navegación */}
          <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <Link to="/consultas" className="nav-link btn btn-outline-light">
                CONSULTAS
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/hospitales" className="nav-link btn btn-outline-light">
                HOSPITALES
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle btn btn-outline-light"
                href="#"
                id="dropdownId"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                PACIENTES
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdownId">
                <Link to="/pacientes/ninnos" className="dropdown-item">
                  NIÑOS
                </Link>
                <Link to="/pacientes/jovenes" className="dropdown-item">
                  JOVENES
                </Link>
                <Link to="/pacientes/ancianos" className="dropdown-item">
                  ANCIANOS
                </Link>
                <Link to="/pacientes/enMayorRiesgo" className="dropdown-item">
                  MAYOR RIESGO
                </Link>
                <Link to="/pacientes/fumadores" className="dropdown-item">
                  FUMADORES
                </Link>
                <Link to="/pacientes/masAncianos" className="dropdown-item">
                  MAS ANCIANO
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Navbar