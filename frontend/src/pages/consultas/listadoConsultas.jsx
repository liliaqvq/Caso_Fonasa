import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ListadoConsultas = () => {
  const [data, setData] = useState([]);
  const [hospitales, setHospitales] = useState([]);
  const [maxPatientsConsulta, setMaxPatientsConsulta] = useState(null);

  useEffect(() => {
    // Fetch data from your API endpoints
    Promise.all([
      fetch("http://127.0.0.1:5000/consultas").then((response) =>
        response.json()
      ),
      fetch("http://127.0.0.1:5000/hospitales").then((response) =>
        response.json()
      ),
    ])
      .then(([consultasData, hospitalesData]) => {
        setData(consultasData);
        setHospitales(hospitalesData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = () => {
    // Buscar la consulta con la mayor cantidad de pacientes
    const consultaMaxPacientes = data.reduce(
      (maxConsulta, consulta) => {
        return consulta.cant_pacientes > maxConsulta.cant_pacientes
          ? consulta
          : maxConsulta;
      },
      { cant_pacientes: -1 }
    ); // Inicializado con un valor mínimo

    // Actualizar el estado con la consulta encontrada
    setMaxPatientsConsulta(consultaMaxPacientes);
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h5 className="mb-0 text-gray-800">
                Listado Consultas
                <Link
                  to="/consultas/agregarConsulta"
                  className="btn btn-primary"
                >
                  <span className="fa fa-plus"></span> Agregar Consulta
                </Link>
              </h5>
              <button
                className="btn btn-primary mt-2"
                type="button"
                onClick={handleSearch}
              >
                Buscar Consulta con mas pacientes atendidos
              </button>
            </div>
            <div className="col-sm-6"></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          {/* SELECT2 EXAMPLE */}
          <div className="card card-default">
            <br />
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-bordered" id="mydatatable">
                  <thead>
                    <tr style={{ backgroundColor: "#f41e3c" }}>
                      <th scope="col">Tipo de consulta</th>
                      <th scope="col">Nombre especialista</th>
                      <th scope="col">Cantidad de pacientes</th>
                      <th scope="col">Hospital</th>
                      <th scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.length > 0 ? (
                      data.map((row, index) => (
                        <tr key={index}>
                          <td>{row.tipo_consulta}</td>
                          <td>{row.nombre_especialista}</td>
                          <td>{row.cant_pacientes}</td>
                          <td>
                            {hospitales.find(
                              (hospital) =>
                                hospital.id_hospital === row.id_hospital
                            )?.nombre || "Hospital no encontrado"}
                          </td>
                          <td>{row.estado}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No hay datos disponibles</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mostrar la consulta con la mayor cantidad de pacientes */}
          {maxPatientsConsulta && (
            <div className="card card-default mt-4">
              <div className="col-md-12">
                <h5>Consulta con mayor cantidad de pacientes:</h5>
                <p>
                  Tipo de consulta: {maxPatientsConsulta.tipo_consulta}
                  <br />
                  Nombre especialista: {maxPatientsConsulta.nombre_especialista}
                  <br />
                  Cantidad de pacientes: {maxPatientsConsulta.cant_pacientes}
                  <br />
                  Hospital:{" "}
                  {hospitales.find(
                    (hospital) =>
                      hospital.id_hospital === maxPatientsConsulta.id_hospital
                  )?.nombre || "Hospital no encontrado"}
                  <br />
                  Estado: {maxPatientsConsulta.estado}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ListadoConsultas;
