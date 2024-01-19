import React, { useState, useEffect } from 'react';

function Cgi() {
  const [cgiData, setCgiData] = useState([]);

  useEffect(() => {
    // Fetch data from your API endpoint for urgent consultations
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/consultas");

        if (!response.ok) {
          throw new Error("Error fetching cgi consultations data");
        }

        const consultasData = await response.json();

        // Filtrar las consultas que son de tipo "URGENCIA"
        const cgiConsultas = consultasData.filter(
          consulta => consulta.tipo_consulta === "CGI"
        );

        setCgiData(cgiConsultas);
      } catch (error) {
        console.error("Error fetching urgent consultations data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2 mx-auto col-md-11 mt-4">
            <div className="col-sm-6">
              <h5 className="mb-0 text-gray-800">
                Lista de Consultas de CGI
              </h5>
            </div>
            <div className="col-sm-6"></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          {/* TABLE EXAMPLE */}
          <div className="card card-default mx-auto col-md-11">
            <br />
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-bordered" id="mydatatable">
                  <thead>
                    <tr style={{ backgroundColor: "#f41e3c" }}>
                      <th scope="col">Tipo de consulta</th>
                      <th scope="col">Nombre especialista</th>
                      <th scope="col">Pacientes atendidos</th>
                      <th scope="col">Hospital</th>
                      <th scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cgiData.map((consulta, index) => (
                      <tr key={index}>
                        <td>{consulta.tipo_consulta}</td>
                        <td>{consulta.nombre_especialista}</td>
                        <td>{consulta.cant_pacientes}</td>
                        <td>
                          {consulta.id_hospital} {/* Ajusta según la estructura de tus datos */}
                        </td>
                        <td
                          className={
                            consulta.estado === "en espera"
                              ? "bg-success"
                              : consulta.estado === "ocupado"
                              ? "bg-danger"
                              : ""
                          }
                        >
                          {consulta.estado}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cgi;
