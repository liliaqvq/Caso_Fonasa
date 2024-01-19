import React, { useEffect, useState } from 'react';

const ListadoMasAncianos = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch('http://127.0.0.1:5000/pacientes/mas_ancianos')
    .then((response) => response.json())
    .then((data) => {
      setData(data);
      setFilteredData(data);
    })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleFilter = () => {
    // Encontrar la edad máxima entre los pacientes
    const maxAge = Math.max(...data.map((paciente) => paciente.edad));
  
    // Filtrar datos por pacientes de mayor edad
    const filtered = data.filter((paciente) => paciente.edad === maxAge);
  
    // Actualizar el estado con los datos filtrados
    setFilteredData(filtered);
  
    // Indicar que se ha realizado la búsqueda
    setSearchClicked(true);
  };
  

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-8">
          <h2 className="text-primary">Pacientes Ancianos</h2>
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleFilter}
          >
            Buscar mas anciano
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {searchClicked && (
            <p>
              Paciente de mayor edad encontrado:
            </p>
          )}

          <div className="table-responsive">
            <table className="table table-bordered table-hover table-space">
              <thead>
                <tr className="bg-danger text-white">
                  <th scope="col">NOMBRE</th>
                  <th scope="col">EDAD</th>
                  <th scope="col">Numero Historia Clinica</th>
                </tr>
              </thead>
              <tbody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.nombre}</td>
                      <td>{row.edad}</td>
                      <td>{row.no_historia_clinica}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">
                      {searchClicked ? "No hay pacientes de mayor edad" : "No data available"}
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

export default ListadoMasAncianos;
