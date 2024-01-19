import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ListadoHospitales = () => {
  // Use the provided hospitals prop if available, otherwise set it to an empty array
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch('http://127.0.0.1:5000/hospitales')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h5 className="mb-0 text-gray-800">
                Listado Hospitales
                <Link
                  to="/hospitales/agregarHospital"
                  className="btn btn-primary"
                >
                  <span className="fa fa-plus"></span> Agregar Hospital
                </Link>
              </h5>
            </div>
            <div className="col-sm-6"></div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="card card-default">
            <br />
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-bordered" id="mydatatable">
                  <thead>
                    <tr style={{ backgroundColor: "#f41e3c" }}>
                      <th scope="col">#</th>
                      <th scope="col">NOMBRE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No hay hospitales disponibles
                        </td>
                      </tr>
                    ) : (
                      data.map((row) => (
                        <tr key={row.id_hospital}>
                          <td>{row.id_hospital}</td>
                          <td>{row.nombre}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListadoHospitales;
