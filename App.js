import React, { useState, useEffect } from 'react';
import './App.css';

// Importar imágenes
import piedraImg from './assets/1.png';
import papelImg from './assets/3.png';
import tijeraImg from './assets/2.png';
import gameTitle from './assets/6.png';

function App() {
  const opciones = [
    { nombre: "piedra", imagen: piedraImg },
    { nombre: "papel", imagen: papelImg },
    { nombre: "tijera", imagen: tijeraImg }
  ];
  
  const [jugador, setJugador] = useState("");
  const [computadora, setComputadora] = useState("");
  const [resultado, setResultado] = useState("");
  const [juegoActivo, setJuegoActivo] = useState(true);
  const [historial, setHistorial] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efecto para rotación automática del carrusel
  useEffect(() => {
    let rotationInterval;
    
    if (juegoActivo) {
      rotationInterval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % opciones.length);
      }, 1000);
    }
    
    return () => clearInterval(rotationInterval);
  }, [juegoActivo, opciones.length]);

  const jugar = (eleccionJugador) => {
    if (!juegoActivo) return;
    
    setJugador(eleccionJugador);
    
    const eleccionComputadora = opciones[Math.floor(Math.random() * opciones.length)].nombre;
    const nuevoResultado = calcularResultado(eleccionJugador, eleccionComputadora);
    
    setComputadora(eleccionComputadora);
    setResultado(nuevoResultado);
    
    const nuevoHistorial = [
      {
        jugador: eleccionJugador,
        computadora: eleccionComputadora,
        resultado: nuevoResultado,
        fecha: new Date().toLocaleTimeString()
      },
      ...historial
    ].slice(0, 10); // Aumentamos a 10 partidas en el historial
    
    setHistorial(nuevoHistorial);
  };

  const calcularResultado = (jugador, computadora) => {
    if (jugador === computadora) return "EMPATE";
    if (
      (jugador === "piedra" && computadora === "tijera") ||
      (jugador === "papel" && computadora === "piedra") ||
      (jugador === "tijera" && computadora === "papel")
    ) return "GANASTE";
    return "PERDISTE";
  };

  const reiniciarJuego = () => {
    setJugador("");
    setComputadora("");
    setResultado("");
    setCurrentIndex(0);
    setJuegoActivo(true);
  };

  const terminarJuego = () => {
    setJuegoActivo(false);
    setResultado("Gracias por jugar, adiosito");
  };

  const limpiarHistorial = () => {
    setHistorial([]);
  };

  const selectCurrentOption = () => {
    jugar(opciones[currentIndex].nombre);
  };

  return (
    <div className="app-container">
      <div className="contenido-principal">
        <div className="juego-container">
          <div className="titulo-imagen">
            <img src={gameTitle} alt="Piedra, Papel o Tijera" />
          </div>
          
          <div className="carrusel-container">
            <div className="opcion-container" onClick={selectCurrentOption}>
              <img 
                src={opciones[currentIndex].imagen} 
                alt={opciones[currentIndex].nombre} 
                className="opcion-imagen"
              />
              <div className="opcion-nombre">{opciones[currentIndex].nombre}</div>
            </div>
          </div>

          <button 
            className="boton-seleccionar"
            onClick={selectCurrentOption}
            disabled={!juegoActivo}
          >
            Seleccionar {opciones[currentIndex].nombre}
          </button>

          {computadora && (
            <div className="eleccion-computadora-container">
              <p>La computadora eligió:</p>
              <div className="eleccion-computadora">
                {opciones.find(op => op.nombre === computadora) && (
                  <img 
                    src={opciones.find(op => op.nombre === computadora).imagen} 
                    alt={computadora} 
                    className="computadora-imagen"
                  />
                )}
              </div>
            </div>
          )}

          {resultado && (
            <h2 className={`resultado ${resultado.includes("GANASTE") ? "ganaste" : ""} ${resultado.includes("PERDISTE") ? "perdiste" : ""}`}>
              {resultado}
            </h2>
          )}

          <div className="botones-accion">
            {juegoActivo ? (
              <button onClick={terminarJuego} className="boton-salir">
                Salir del juego
              </button>
            ) : (
              <button onClick={reiniciarJuego} className="boton-reiniciar">
                Jugar otra vez
              </button>
            )}
          </div>
        </div>

        <div className="historial-lateral">
          <div className="historial-header">
            <h3>Historial de partidas</h3>
            <button onClick={limpiarHistorial} className="boton-limpiar">
              Limpiar
            </button>
          </div>
          <div className="historial">
            {historial.length > 0 ? (
              historial.map((item, index) => (
                <div key={index} className="partida">
                  <div className="partida-info">
                    <span className="hora">{item.fecha}</span>
                    <div className="elecciones">
                      <span>Tú: <strong>{item.jugador}</strong></span>
                      <span>PC: <strong>{item.computadora}</strong></span>
                    </div>
                  </div>
                  <span className={`resultado-partida ${item.resultado.includes("GANASTE") ? "ganaste" : ""} ${item.resultado.includes("PERDISTE") ? "perdiste" : ""}`}>
                    {item.resultado}
                  </span>
                </div>
              ))
            ) : (
              <p className="sin-historial">No hay partidas registradas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;