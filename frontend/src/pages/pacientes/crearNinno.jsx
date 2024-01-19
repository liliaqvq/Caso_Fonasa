import React, { useState } from "react";

const CrearNinno = () => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [relacionPesoEstatura, setRelacionPesoEstatura] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [riesgo, setRiesgo] = useState("");
  const [noHistoriaClinica, setNoHistoriaClinica] = useState("");

  const calcularPrioridad = (edad, pesoEstatura) => {
    if (edad >= 1 && edad <= 5) {
      return pesoEstatura + 3;
    } else if (edad >= 6 && edad <= 12) {
      return pesoEstatura + 2;
    } else {
      return pesoEstatura + 1;
    }
  };
  

  const calcularRiesgo = (edad, prioridad) => {
    return (edad * prioridad) / 100;
  };

  const actualizarValores = () => {
    const parsedEdad = parseInt(edad);
    const parsedPesoEstatura =
      relacionPesoEstatura === "" ? 0 : parseInt(relacionPesoEstatura);

    console.log("Parsed Edad:", parsedEdad);
    console.log("Parsed Peso Estatura:", parsedPesoEstatura);

    if (!isNaN(parsedEdad) && !isNaN(parsedPesoEstatura)) {
      const calculatedPrioridad = calcularPrioridad(
        parsedEdad,
        parsedPesoEstatura
      );
      const calculatedRiesgo = calcularRiesgo(parsedEdad, calculatedPrioridad);

      console.log("Calculated Prioridad:", calculatedPrioridad);
      console.log("Calculated Riesgo:", calculatedRiesgo);

      setPrioridad(calculatedPrioridad.toFixed(2));
      setRiesgo(calculatedRiesgo.toFixed(2));
    } else {
      console.error("Invalid input values for edad or relacionPesoEstatura");
    }
  };

  const generarNumeroHistoriaClinica = () => {
    const randomNum = Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(9, "0");
    setNoHistoriaClinica(randomNum);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Realiza las acciones necesarias con los datos del formulario
    const data = {
      nombre,
      edad,
      relacionPesoEstatura,
      noHistoriaClinica,
      prioridad,
      riesgo,
    };

    console.log("Data a enviar:", data);  // debug

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
    setRelacionPesoEstatura("");
    setPrioridad("");
    setRiesgo("");
    setNoHistoriaClinica("");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">FORMULARIO PACIENTE NIÑO</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    NOMBRE
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ingrese nombre del paciente"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="edad" className="form-label">
                    EDAD (1-15)
                  </label>
                  <input
                    type="number"
                    id="edad"
                    name="edad"
                    className="form-control"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    min="1"
                    max="15"
                    placeholder="Ingrese edad del paciente"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="no_historiaclinica" className="form-label">
                    NUM-HISTORIA-CLINICA
                  </label>
                  <input
                    type="number"
                    name="no_historiaclinica"
                    id="no_historiaclinica"
                    value={noHistoriaClinica}
                    maxLength="16"
                    size="16"
                    className="form-control"
                    readOnly
                  />
                  <button type="button" onClick={generarNumeroHistoriaClinica}>
                    Asignar N° Historia Clínica
                  </button>
                </div>

                <div className="mb-3">
                  <label htmlFor="relacion_pesoestatura" className="form-label">
                    RELACION-PESO-ESTATURA
                  </label>
                  <input
                    type="number"
                    id="relacion_pesoestatura"
                    name="relacion_pesoestatura"
                    className="form-control"
                    value={relacionPesoEstatura}
                    onChange={(e) => setRelacionPesoEstatura(e.target.value)}
                    onBlur={() => actualizarValores()} // Call actualizarValores onBlur
                    min="1"
                    max="4"
                    placeholder="Ingrese RPE del paciente"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="prioridad">
                    PRIORIDAD (Se generará una vez ingresada la edad y RPE)
                  </label>
                  <input
                    type="number"
                    name="prioridad"
                    id="prioridad"
                    className="form-control"
                    value={prioridad}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="riesgo">
                    RIESGO (Se generará una vez ingresada la edad y RPE)
                  </label>
                  <input
                    type="number"
                    name="riesgo"
                    id="riesgo"
                    className="form-control"
                    value={riesgo}
                    readOnly
                  />
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

export default CrearNinno;
