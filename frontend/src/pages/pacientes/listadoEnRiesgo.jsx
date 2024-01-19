import React, { useEffect, useState } from "react";

const ListadoEnRiesgo = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch("http://127.0.0.1:5000/pacientes/riesgo")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = () => {
    // Buscar el paciente por número de historia clínica
    const foundPatient = data.find(
      (paciente) => paciente.no_historia_clinica.toString() === searchTerm
    );
  
    // Filtrar datos por riesgo mayor al riesgo del paciente encontrado
    if (foundPatient) {
      const filtered = data.filter(
        (paciente) => paciente.riesgo > foundPatient.riesgo
      );
      setFilteredData(filtered);
      setSearchClicked(true);
    } else {
      // Si no se encuentra el paciente, mostrar todos los datos
      setFilteredData(data);
      setSearchClicked(false);
    }
  };
  

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-8">
          <h2 className="text-primary">Todos los Pacientes en orden de riesgo</h2>
        </div>
        <div className="col-md-4">
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              placeholder="Número de Historia Clínica"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSearch}
            >
              Buscar
            </button>
          </div>
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
                      <th scope="col">NHC</th>
                      <th scope="col">RIESGO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row) => (
                      <tr key={row.id}>
                        <td>{row.nombre}</td>
                        <td>{row.edad}</td>
                        <td>{row.no_historia_clinica}</td>
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

export default ListadoEnRiesgo;
