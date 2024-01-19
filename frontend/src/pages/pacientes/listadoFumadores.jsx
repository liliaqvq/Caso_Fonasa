import React, { useEffect, useState } from "react";

const ListadoFumadores = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch("http://127.0.0.1:5000/pacientes/fumadores")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleFilter = () => {
    // Filtrar datos por riesgo mayor a 4
    const filtered = data.filter((paciente) => paciente.prioridad > 4);
    setFilteredData(filtered);
    setSearchClicked(true);
  };

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-8">
          <h2 className="text-primary">Pacientes Fumadores</h2>
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleFilter}
          >
            Buscar fumadores urgentes
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {filteredData && filteredData.length > 0 && searchClicked && (
            <p>
              Los pacientes fumadores urgentes son:
            </p>
          )}

          <div className="table-responsive">
            <table
              className="table table-bordered table-hover table-space"
              id="mydatatable"
            >
              <thead>
                <tr className="bg-danger text-white">
                  <th scope="col">NOMBRE</th>
                  <th scope="col">EDAD</th>
                  <th scope="col">NHC</th>
                  <th scope="col">PRIORIDAD</th>
                  <th scope="col">RIESGO</th>
                </tr>
              </thead>
              <tbody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.nombre}</td>
                      <td>{row.edad}</td>
                      <td>{row.no_historia_clinica}</td>
                      <td>{row.prioridad}</td>
                      <td>{row.riesgo}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      {searchClicked
                        ? "No hay pacientes con Prioridad > 4"
                        : "No data available"}
                    </td>
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

export default ListadoFumadores;
