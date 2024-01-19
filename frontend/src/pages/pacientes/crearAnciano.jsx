import React, { useEffect, useState } from "react";

const CrearAnciano = () => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [tieneDieta, setTieneDieta] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [riesgo, setRiesgo] = useState("");
  const [noHistoriaClinica, setNoHistoriaClinica] = useState("");

  const calcularPrioridad = (edad, tieneDieta) => {
    if (tieneDieta === "si") {
      if (edad >= 60 && edad < 101) {
        return edad / 20 + 4;
      } else {
        return edad / 30 + 3;
      }
    } else {
      return edad / 30 + 3;
    }
  };

  const calcularRiesgo = (edad, prioridad) => {
    return (edad * prioridad) / 100 + 5.3;
  };

  const generarNumeroHistoriaClinica = () => {
    const randomNum = Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(9, "0");
    setNoHistoriaClinica(randomNum);
  };

  // useEffect para actualizar prioridad y riesgo cuando cambia la edad y dieta
  useEffect(() => {
    // Verifica que la edad y el estado de dieta sean números válidos antes de calcular
    if (!isNaN(edad) && edad >= 41 && edad <= 100 && tieneDieta !== "") {
      const nuevaPrioridad = calcularPrioridad(parseInt(edad), tieneDieta);
      const nuevoRiesgo = calcularRiesgo(parseInt(edad), nuevaPrioridad);
      console.log("Nueva Prioridad:", nuevaPrioridad);
      console.log("Nuevo Riesgo:", nuevoRiesgo);
      // Actualiza los estados con los nuevos valores calculados
      setPrioridad(nuevaPrioridad.toFixed(2));
      setRiesgo(nuevoRiesgo.toFixed(2));
    }
  }, [edad, tieneDieta]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add your form submission logic here
    const data = {
      nombre,
      edad,
      tieneDieta,
      noHistoriaClinica,
      prioridad,
      riesgo,
    };

    console.log("Data a enviar:", data); // debug


    try {
      const response = await fetch("http://127.0.0.1:5000/pacientes/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Paciente guardado exitosamente");
        // Realiza otras acciones si es necesario
      } else {
        console.error("Error al guardar el paciente");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }


    // Limpia los campos después de enviar el formulario
    setNombre("");
    setEdad("");
    setTieneDieta("");
    setPrioridad("");
    setRiesgo("");
    setNoHistoriaClinica("");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">FORMULARIO PACIENTE ANCIANO</div>
            <div className="card-body">

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    NOMBRE
                  </label>
                  <input
                    required
                    onChange={(e) => setNombre(e.target.value)}
                    value={nombre}
                    onKeyPress={(e) => e.charCode >= 65 && e.charCode <= 122}
                    placeholder="Ingrese nombre del paciente"
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="edad" className="form-label">
                    EDAD (41-100)
                  </label>
                  <input
                    min="41"
                    max="100"
                    onChange={(e) => setEdad(e.target.value)}
                    value={edad}
                    placeholder="Ingrese edad del paciente"
                    type="number"
                    id="edad"
                    name="edad"
                    className="form-control"
                  />
                  {/* Error handling for edad */}
                </div>

                <div className="mb-3">
                  <label htmlFor="num_historiaclinica" className="form-label">
                    NUMERO HISTORIA CLINICA
                  </label>
                  <input
                    readOnly
                    name="num_historiaclinica"
                    id="num_historiaclinica"
                    value={noHistoriaClinica}
                    maxLength="16"
                    size="16"
                    className="form-control"
                  />
                  <button type="button" onClick={generarNumeroHistoriaClinica}>
                    Asignar N° Historia Clínica
                  </button>
                </div>

                <div className="mb-3">
                  <label htmlFor="tiene_dieta" className="form-label">
                    ¿TIENE DIETA?:
                  </label>
                  <select
                    name="tiene_dieta"
                    id="tiene_dieta"
                    onChange={(e) => setTieneDieta(e.target.value)}
                    value={tieneDieta}
                    className="form-control"
                  >
                    <option value="">Seleccionar</option>
                    <option value="si">SI</option>
                    <option value="no">NO</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="prioridad" className="form-label">
                    PRIORIDAD
                  </label>
                  <input
                    readOnly
                    type="number"
                    name="prioridad"
                    id="prioridad"
                    value={prioridad}
                    className="form-control"
                  />
                  {/* Error handling for prioridad */}
                </div>

                <div className="mb-3">
                  <label htmlFor="riesgo" className="form-label">
                    RIESGO
                  </label>
                  <input
                    readOnly
                    type="number"
                    name="riesgo"
                    id="riesgo"
                    value={riesgo}
                    className="form-control"
                  />
                  {/* Error handling for riesgo */}
                </div>

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
  );
};

export default CrearAnciano;
