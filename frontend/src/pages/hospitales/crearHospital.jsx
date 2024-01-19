import React, { useState } from "react";

const CrearHospital = () => {
  const [nombre, setNombre] = useState(""); // Cambiado aquí

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission, you can perform any actions here
    const data = {
      nombre
    };

    console.log("Data a enviar:", { data });

    try {
      const response = await fetch("http://127.0.0.1:5000/hospitales/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Hospital guardado exitosamente");
        // Realiza otras acciones si es necesario
      } else {
        console.error("Error al guardar el hospital");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }

    // Limpia los campos después de enviar el formulario
    setNombre("");
  };

  return (
    <div className="content-wrapper">
      <section className="content">
        <div className="container-fluid">
          <div className="card card-default">
            <br />
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">AGREGAR HOSPITAL</div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="nom_hospital" className="form-label">
                        NOMBRE
                      </label>
                      <input
                        placeholder="Ingrese el nombre del hospital"
                        type="text"
                        id="nom_hospital"
                        name="nom_hospital"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="form-control"
                      />
                      {/* Display validation error if needed */}
                      {/* {validationErrors.nom_hospital && (
                        <span className="help-block">{validationErrors.nom_hospital}</span>
                      )} */}
                    </div>

                    <button type="submit" className="btn btn-primary">
                      INGRESAR
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CrearHospital;
