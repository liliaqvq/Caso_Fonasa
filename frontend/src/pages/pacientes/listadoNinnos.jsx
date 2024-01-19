import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ListadoNinnos = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch('http://127.0.0.1:5000/pacientes/ninnos')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-8">
          <h2 className="text-primary">Listado Paciente-Niño/a</h2>
        </div>
        <div className="col-md-4 text-end">
          <Link to="/pacientes/agregarNinno" className="btn btn-primary">
            <i className="fa fa-plus me-2"></i> Agregar Paciente
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered table-hover table-space"
              id="mydatatable"
            >
              <thead>
                <tr className="bg-danger text-white">
                  <th>NOMBRE</th>
                  <th>EDAD</th>
                  <th>NUMERO-HISTORIA-CLINICA</th>
                  <th>PRIORIDAD</th>
                  <th>RIESGO</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.nombre}</td>
                      <td>{row.edad}</td>
                      <td>{row.no_historia_clinica}</td>
                      <td>{row.prioridad}</td>
                      <td>{row.riesgo}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No hay datos disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListadoNinnos;
