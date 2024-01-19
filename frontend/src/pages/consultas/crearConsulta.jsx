import React, { useEffect, useState } from "react";

const CrearConsulta = () => {
  const [idHospital, setIdHospital] = useState("");
  const [cantPacientes, setCantPacientes] = useState("");
  const [nombreEspecialista, setNombreEspecialista] = useState("");
  const [tipoConsulta, setTipoConsulta] = useState("");
  const [estado, setEstado] = useState("");
  const [hospitales, setHospitales] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");

  useEffect(() => {
    // Aquí puedes realizar una llamada a la API para obtener la lista de hospitales
    // y actualizar el estado 'hospitales' con esa información
    fetch("http://127.0.0.1:5000/hospitales")
      .then((response) => response.json())
      .then((data) => setHospitales(data))
      .catch((error) => console.error("Error fetching hospitals:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    const data = {
      id_hospital: selectedHospital,
      cant_pacientes: cantPacientes,
      nombre_especialista: nombreEspecialista,
      tipo_consulta: tipoConsulta,
      estado,
    };

    console.log("Data a enviar:", { data });

    try {
      const response = await fetch("http://127.0.0.1:5000/consultas/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Consulta guardada exitosamente");
        // Realiza otras acciones si es necesario
      } else {
        console.error("Error al guardar la consulta");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }

    // Limpia los campos después de enviar el formulario
    setIdHospital("");
    setCantPacientes("");
    setNombreEspecialista("");
    setTipoConsulta("");
    setEstado("");
  };

  return (
    <div className="content-wrapper">
      <section className="content">
        <div className="container-fluid">
          <div className="card card-default">
            <br />
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">FORMULARIO CONSULTAS</div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    {/* Input para Seleccionar el Hospital */}
                    <div className="mb-3">
                      <label htmlFor="idHospital" className="form-label">
                        Hospital
                      </label>
                      <select
                        id="idHospital"
                        name="idHospital"
                        value={selectedHospital}
                        onChange={(e) => {
                          const selectedHospitalId = e.target.value;
                          setSelectedHospital(selectedHospitalId);
                          setIdHospital(selectedHospitalId); // Esto es opcional, depende de cómo quieras usar el id
                        }}
                        className="form-control"
                      >
                        <option value="" disabled>
                          -- Seleccione un Hospital --
                        </option>
                        {hospitales.map((hospital) => (
                          <option
                            key={hospital.id_hospital}
                            value={hospital.id_hospital}
                          >
                            {hospital.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Input para Cantidad de Pacientes */}
                    <div className="mb-3">
                      <label htmlFor="cantPacientes" className="form-label">
                        Cantidad de Pacientes
                      </label>
                      <input
                        type="number"
                        id="cantPacientes"
                        name="cantPacientes"
                        value={cantPacientes}
                        onChange={(e) => setCantPacientes(e.target.value)}
                        className="form-control"
                      />
                    </div>

                    {/* Input para Nombre del Especialista */}
                    <div className="mb-3">
                      <label
                        htmlFor="nombreEspecialista"
                        className="form-label"
                      >
                        Nombre del Especialista
                      </label>
                      <input
                        type="text"
                        id="nombreEspecialista"
                        name="nombreEspecialista"
                        value={nombreEspecialista}
                        onChange={(e) => setNombreEspecialista(e.target.value)}
                        className="form-control"
                      />
                    </div>

                    {/* Input para Tipo de Consulta */}
                    <div className="mb-3">
                      <label htmlFor="tipoConsulta" className="form-label">
                        Tipo de Consulta
                      </label>
                      <select
                        id="tipoConsulta"
                        name="tipoConsulta"
                        value={tipoConsulta}
                        onChange={(e) => setTipoConsulta(e.target.value.toUpperCase())}
                        className="form-control"
                      >
                        <option value="" disabled>
                          -- Seleccione un Tipo de Consulta --
                        </option>
                        <option value="pediatria">Pediatría</option>
                        <option value="urgencia">Urgencia</option>
                        <option value="CGI">CGI</option>
                      </select>
                    </div>

                    {/* Input para Estado de la consulta */}
                    <div className="mb-3">
                      <label htmlFor="estado" className="form-label">
                        Estado Consulta
                      </label>
                      <select
                        id="estado"
                        name="estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="form-control"
                      >
                        <option value="" disabled>
                          -- Seleccione Estado de Consulta --
                        </option>
                        <option value="ocupado">Ocupado</option>
                        <option value="en espera">En espera</option>
                      </select>
                    </div>

                    {/* Repetir el patrón para los demás campos */}
                    {/* ... */}

                    <button type="submit" className="btn btn-primary">
                      INGRESAR
                    </button>
                  </form>
                </div>
                <div className="card-footer text-muted">Footer</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CrearConsulta;
