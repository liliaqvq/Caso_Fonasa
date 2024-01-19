import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Body with Background Image */}
      <div
        style={{
          position: "relative",
          backgroundImage:
            'url("https://reliablebackgroundscreening.com/wp-content/uploads/2021/08/The-Importance-of-Healthcare-Background-Checks.jpg")',
          backgroundSize: "cover",
          minHeight: "500px",
        }} 
      >
        {/* Salas de espera */}
        <h2
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#306285",
            fontSize: "40px",
            fontWeight: "bold",
            zIndex: "1", // Asegura que el h2 esté sobre los divs
          }}
        >
          Salas de espera:
        </h2>
        {/* Div 1 */}
        <Link to="/pediatria">
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "30%",
              width: "250px",
              height: "150px",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparente oscuro
              padding: "20px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: "25px" }}>Pediatría</span>
          </div>
        </Link>

        {/* Div 2 */}
        <Link to="/urgencia">
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "250px",
              height: "150px",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparente oscuro
              padding: "20px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: "25px" }}>Urgencia</span>
          </div>
        </Link>

        {/* Div 3 */}
        <Link to="/cgi">
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "70%",
              width: "250px",
              height: "150px",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparente oscuro
              padding: "20px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: "25px" }}>CGI</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
