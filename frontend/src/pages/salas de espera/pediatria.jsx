import React, { useEffect, useState } from "react";

function Pediatria() {
  const [data, setData] = useState([]);
  const [hospitales, setHospitales] = useState([]);
  const [ninnos, setNinnos] = useState([]);
  const [ninnosLiberados, setNinnosLiberados] = useState([]);

  useEffect(() => {
    // Cargar los ninnosLiberados almacenados al montar el componente
    const storedNinnosLiberados = localStorage.getItem("ninnosLiberados");
    if (storedNinnosLiberados) {
      setNinnosLiberados(JSON.parse(storedNinnosLiberados));
    }

    // Fetch data from your API endpoints
    const fetchData = async () => {
      try {
        const [consultasResponse, hospitalesResponse, ninnosResponse] =
          await Promise.all([
            fetch("http://127.0.0.1:5000/consultas"),
            fetch("http://127.0.0.1:5000/hospitales"),
            fetch("http://127.0.0.1:5000/pacientes/ninnos"),
          ]);

        if (
          !consultasResponse.ok ||
          !hospitalesResponse.ok ||
          !ninnosResponse.ok
        ) {
          throw new Error("Error fetching data");
        }

        const [consultasData, hospitalesData, ninnosData] = await Promise.all([
          consultasResponse.json(),
          hospitalesResponse.json(),
          ninnosResponse.json(),
        ]);

        console.log("Fetched data from the server:", consultasData);

        setData(consultasData);
        setHospitales(hospitalesData);
        setNinnos(ninnosData);

        // Actualizar el estado ninnosLiberados solo si no hay datos almacenados localmente
        if (!storedNinnosLiberados) {
          const ninnosLiberadosData = await fetch(
            "http://127.0.0.1:5000/pacientes/ninnos/prioridad_menor_4"
          ).then((response) => response.json());

          // Guardar los ninnosLiberados en localStorage o sessionStorage
          localStorage.setItem(
            "ninnosLiberados",
            JSON.stringify(ninnosLiberadosData)
          );

          // Actualizar el estado ninnosLiberados
          setNinnosLiberados(ninnosLiberadosData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const ocuparConsulta = async (idConsulta) => {
    try {
      // Incrementar la cantidad de pacientes atendidos en 1
      const consultaIndex = data.findIndex(
        (row) => row.id_consulta === idConsulta
      );
      const cantidadActualPacientes = data[consultaIndex].cant_pacientes;

      // Check if the index is valid
      if (consultaIndex !== -1) {
        // Obtén la información del paciente
        const pacienteSeleccionado = data[consultaIndex];

        // Verifica si es un paciente pediátrico y su prioridad es menor a 4
        if (
          pacienteSeleccionado.tipo_paciente === "paciente_nino" &&
          pacienteSeleccionado.prioridad < 4
        ) {
          // Elimina al paciente de la lista de ninos
          await eliminarPacientePendienteNinno(
            pacienteSeleccionado.id_paciente
          );
        }

        // Actualizar el estado de la consulta a "ocupado"
        await actualizarEstadoConsulta(
          idConsulta,
          "ocupado",
          cantidadActualPacientes + 1
        );

        // Obtener los datos actualizados después de la actualización
        const updatedConsultasData = await fetch(
          "http://127.0.0.1:5000/consultas"
        ).then((response) => response.json());

        // Actualizar el estado con los datos actualizados
        setData(updatedConsultasData);
        console.log(
          "Cantidad de pacientes después de la actualización:",
          updatedConsultasData[consultaIndex].cant_pacientes
        );
      }
    } catch (error) {
      console.error("Error al asignar paciente:", error);
    }
  };

  // Nueva función para eliminar paciente de la lista de ninnos
  const eliminarPacientePendienteNinno = async (idPaciente) => {
    try {
      // Realizar la solicitud al servidor para obtener la información del paciente
      const pacienteResponse = await fetch(
        `http://127.0.0.1:5000/pacientes/ninnos/${idPaciente}`
      );
      const pacienteData = await pacienteResponse.json();

      // Verificar si el paciente cumple con la condición de prioridad
      if (pacienteData && pacienteData.prioridad > 4) {
        // Realizar la solicitud DELETE para eliminar al paciente de la lista de ninnos
        const response = await fetch(
          `http://127.0.0.1:5000/pacientes/ninnos/${idPaciente}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al eliminar paciente de la lista de ninnos");
        }

        console.log(
          `Paciente con ID ${idPaciente} eliminado de la lista de ninnos`
        );
      } else {
        console.log(
          `Paciente con ID ${idPaciente} no cumple con la condición de prioridad`
        );
      }
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
    }
  };

  const actualizarEstadoConsulta = async (
    idConsulta,
    nuevoEstado,
    nuevaCantidadPacientes
  ) => {
    try {
      // Realizar la solicitud al servidor para actualizar el estado de la consulta
      const response = await fetch(
        `http://127.0.0.1:5000/consultas/${idConsulta}/actualizarEstado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nuevoEstado,
            nuevaCantidadPacientes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error al ${
            nuevoEstado === "en espera" ? "liberar" : "ocupar"
          } la consulta`
        );
      }

      // Después de actualizar el estado, volver a cargar los datos actualizados
      const consultasData = await fetch("http://127.0.0.1:5000/consultas").then(
        (response) => response.json()
      );

      // Actualizar el estado con los datos actualizados
      setData(consultasData);
    } catch (error) {
      console.error(
        `Error al ${
          nuevoEstado === "en espera" ? "liberar" : "ocupar"
        } la consulta:`,
        error
      );
    }
  };
  const atenderTodosPacientes = async () => {
    try {
      // Obtener la lista de pacientes pediátricos en sala de espera
      const pacientesEnEspera = ninnosLiberados.filter(
        (ninno) => ninno.prioridad < 4
      );
  
      if (pacientesEnEspera.length === 0) {
        console.log("No hay pacientes en la sala de espera.");
        return;
      }
  
      // Obtener la cantidad total de consultas disponibles
      const consultasDisponibles = data.filter(
        (consulta) => consulta.estado === "en espera"
      );
  
      // Iterar sobre todas las consultas y asignar pacientes
      for (let i = 0; i < consultasDisponibles.length; i++) {
        const pacienteEnEspera = pacientesEnEspera[i];
  
        if (pacienteEnEspera) {
          // Atender al paciente y ocupar la consulta
          await ocuparConsulta(
            consultasDisponibles[i].id_consulta,
            pacienteEnEspera.id_paciente
          );
  
          // Actualizar la lista de pacientes en espera después de ocupar la consulta
          const updatedNinnosLiberados = ninnosLiberados.filter(
            (ninno) => ninno.id_paciente !== pacienteEnEspera.id_paciente
          );
  
          setNinnosLiberados(updatedNinnosLiberados);
        } else {
          // Si no hay más pacientes, salir del bucle
          console.log("No hay más pacientes para asignar a consultas.");
          break;
        }
      }
  
      // Después de atender a los pacientes, obtener los datos actualizados
      const updatedConsultasData = await fetch(
        "http://127.0.0.1:5000/consultas"
      ).then((response) => response.json());
  
      // Actualizar el estado con los datos actualizados
      setData(updatedConsultasData);
  
      console.log("Pacientes atendidos y consultas ocupadas");
    } catch (error) {
      console.error("Error al atender a todos los pacientes:", error);
    }
  };
  

  const liberarTodasConsultas = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/consultas/liberar_todas",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al liberar todas las consultas");
      }

      const consultasData = await response.json();
      setData(consultasData);
      // Después de atender a todos los pacientes, obtener los datos actualizados
      const updatedConsultasData = await fetch(
        "http://127.0.0.1:5000/consultas"
      ).then((response) => response.json());

      // Actualizar el estado con los datos actualizados
      setData(updatedConsultasData);

      // Obtener los ninnos con prioridad menor a 4 y agregarlos a ninnosLiberados
      const ninnosLiberadosData = await fetch(
        "http://127.0.0.1:5000/pacientes/ninnos/prioridad_menor_4"
      ).then((response) => response.json());

      // Guardar los ninnosLiberados en localStorage o sessionStorage
      localStorage.setItem(
        "ninnosLiberados",
        JSON.stringify(ninnosLiberadosData)
      );

      // Cambiar el estado de todas las consultas a "en espera"
      for (const consulta of updatedConsultasData) {
        await actualizarEstadoConsulta(
          consulta.id_consulta,
          "en espera",
          consulta.cant_pacientes
        );
      }

      // Actualizar el estado ninnosLiberados
      setNinnosLiberados(ninnosLiberadosData);

      console.log("Todas las consultas han sido liberadas");
    } catch (error) {
      console.error("Error al liberar todas las consultas:", error);
    }
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2 mx-auto col-md-11 mt-4">
            <div className="col-sm-6">
              <h5 className="mb-0 text-gray-800">
                Disponibilidad de Consultas Pediatricas
              </h5>
            </div>
            <div className="col-sm-6"></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          {/* SELECT2 EXAMPLE */}
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
                    {data && data.length > 0 ? (
                      data
                        .filter((row) => row.tipo_consulta === "PEDIATRIA") // Filtrar por tipo de consulta pediatría
                        .map((row, index) => (
                          <tr key={index}>
                            <td>{row.tipo_consulta}</td>
                            <td>{row.nombre_especialista}</td>
                            <td>{row.cant_pacientes}</td>
                            <td>
                              {hospitales.find(
                                (hospital) =>
                                  hospital.id_hospital === row.id_hospital
                              )?.nombre || "Hospital no encontrado"}
                            </td>
                            <td
                              className={
                                row.estado === "en espera"
                                  ? "bg-success"
                                  : row.estado === "ocupado"
                                  ? "bg-danger"
                                  : ""
                              }
                            >
                              {row.estado}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="4">No hay datos disponibles</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <button
            className="btn btn-warning my-4 ms-5"
            onClick={liberarTodasConsultas}
          >
            Liberar Todas Consultas
          </button>

          {/* Nuevo botón para atender a todos los pacientes */}
          <button
            className="btn btn-success my-4 ms-2"
            onClick={atenderTodosPacientes}
          >
            Atender Pacientes
          </button>

          {/* Nueva tabla y título */}
          <div className="card card-default mx-auto col-md-8 mb-4">
            <div className="col-md-12">
              <h5>Pacientes pediátricos en sala de espera:</h5>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <table className="table table-bordered" id="mydatatable">
                    <thead>
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Edad</th>
                        <th scope="col">Número de Historia Clínica</th>
                        <th scope="col">Prioridad</th>
                        <th scope="col">Riesgo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ninnosLiberados && ninnosLiberados.length > 0 ? (
                        ninnosLiberados.map((row, index) => (
                          <tr key={index}>
                            <td>{row.nombre}</td>
                            <td>{row.edad}</td>
                            <td>{row.no_historia_clinica}</td>
                            <td>{row.prioridad}</td>
                            <td>{row.riesgo}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No hay datos disponibles</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Pediatria;
