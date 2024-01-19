import React, { useEffect, useState } from "react";

const PacientesPendientes = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const [pacientesEnSalaEspera, setPacientesEnSalaEspera] = useState([]);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch("http://127.0.0.1:5000/pacientes/pendientes")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


  const handleSearch = () => {
    // Filtrar los pacientes pendientes que no están en la sala de espera de pediatría
    const filteredPendientes = filteredData.filter(
      (pendiente) =>
        !pacientesEnSalaEspera.find((enEspera) => enEspera.id === pendiente.id)
    );
    setFilteredData(filteredPendientes);
    setSearchClicked(true);
  };


  // Para que tipo de paciente sea mas amigable para el usuario
  const tipoPacienteLabels = {
    paciente_nino: 'Niño',
    paciente_joven: 'Joven',
    paciente_anciano: 'Anciano',
  };
  

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-8">
          <h2 className="text-primary">Pacientes pendientes por orden de llegada</h2>
        </div>
        <div className="col-md-4">
        </div>
      </div>
  
      <div className="card">
        <div className="card-body">
          {filteredData && filteredData.length > 0 ? (
            <>
              {searchClicked && (
                      <p>
                        Los pacientes encontrados con mayor riesgo al paciente ingresado son:
                      </p>
                    )}
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-space">
                  <thead>
                    <tr className="bg-danger text-white">
                      <th scope="col">NOMBRE</th>
                      <th scope="col">EDAD</th>
                      <th scope="col">TIPO DE PACIENTE</th>
                      <th scope="col">N° HISTORIA CLINICA</th>
                      <th scope="col">PRIORIDAD</th>
                      <th scope="col">RIESGO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row) => (
                      <tr key={row.id}>
                        <td>{row.nombre}</td>
                        <td>{row.edad}</td>
                        <td>{tipoPacienteLabels[row.tipo_paciente]}</td>
                        <td>{row.no_historia_clinica}</td>
                        <td>{row.prioridad}</td>
                        <td>{row.riesgo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p>No se encontraron pacientes con mayor riesgo al paciente ingresado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PacientesPendientes;