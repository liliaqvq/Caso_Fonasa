import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import injectContext from './store/AppContext'
import Home from './pages/Home'
import Register from './pages/Register'
import Navbar from './pages/Navbar';
import Profile from './pages/Profile';
import ListadoConsultas from './pages/consultas/listadoConsultas';
import CrearConsulta from './pages/consultas/crearConsulta'
import ListadoNinnos from './pages/pacientes/listadoNinnos'
import CrearNinno from './pages/pacientes/crearNinno'
import ListadoJovenes from './pages/pacientes/listadoJovenes'
import CrearJoven from './pages/pacientes/crearJoven'
import ListadoAncianos from './pages/pacientes/listadoAncianos'
import CrearAnciano from './pages/pacientes/crearAnciano'
import ListadoEnRiesgo from './pages/pacientes/listadoEnRiesgo'
import ListadoFumadores from './pages/pacientes/listadoFumadores'
import ListadoMasAncianos from './pages/pacientes/listadoMasAncianos'
import ListadoHospitales from './pages/hospitales/listadoHospitales'
import CrearHospital from './pages/hospitales/crearHospital'
import Footer from './pages/Footer'
import PacientesPendientes from './pages/pacientes/pendientes'
import Pediatria from './pages/salas de espera/pediatria'
import Urgencia from './pages/salas de espera/urgencia'
import Cgi from './pages/salas de espera/cgi'

const ConsultasRoutes = () => (
  <Routes>
    <Route path="/*" element={<ListadoConsultas />} /> {/*   "/*", it means that this route will match any path that starts with the specified base path   */}
    <Route path="agregarConsulta" element={<CrearConsulta />} />
  </Routes>
);

const PacientesRoutes = () => (
  <Routes>
    <Route path="ninnos" element={<ListadoNinnos />} />
    <Route path="agregarNinno" element={<CrearNinno />} />
    <Route path="jovenes" element={<ListadoJovenes />} />
    <Route path="agregarJoven" element={<CrearJoven />} />
    <Route path="ancianos" element={<ListadoAncianos />} />
    <Route path="agregarAnciano" element={<CrearAnciano />} />
    <Route path="enMayorRiesgo" element={<ListadoEnRiesgo />} />
    <Route path="fumadores" element={<ListadoFumadores />} />
    <Route path="masAncianos" element={<ListadoMasAncianos />} />
    <Route path="pendientes" element={<PacientesPendientes />} />
  </Routes>
);

const HospitalesRoutes = () => (
  <Routes>
    <Route path="/*" element={<ListadoHospitales />} />
    <Route path="agregarHospital" element={<CrearHospital />} />
  </Routes>
)

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="consultas/*" element={<ConsultasRoutes />} />
        <Route path="pacientes/*" element={<PacientesRoutes />} />
        <Route path="hospitales/*" element={<HospitalesRoutes />} />

        <Route path="profile" element={<Profile />} />
        <Route path="register" element={<Register />} />
        <Route path="pediatria" element={<Pediatria />} />
        <Route path="urgencia" element={<Urgencia />} />
        <Route path="cgi" element={<Cgi />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default injectContext(App);