import { useEffect, useState } from 'react'
import Casilla from './components/Casilla.jsx'
import Teclado from './components/Teclado.jsx'
import {
  FILAS,
  tableroVacio,
  palabraAlAzar,
  estadosDeFila,
  estadosDelTeclado,
} from './juego.js'

function App() {
  const [intentos, setIntentos] = useState(tableroVacio())
  const [filaActual, setFilaActual] = useState(0)
  const [solucion, setSolucion] = useState(() => palabraAlAzar())
  const [aviso, setAviso] = useState('')

  // El último intento comprobado, como texto: 'PERRO'
  const ultimo = filaActual > 0 ? intentos[filaActual - 1].join('') : ''
  const ganada = ultimo === solucion
  const terminada = ganada || filaActual === FILAS

  useEffect(() => {
    // Lleva el cursor a la primera casilla en la que se puede escribir
    document.querySelector('.casilla:enabled')?.focus()
  }, [filaActual])

  // Copia el tablero, cambia una letra y guarda la copia
  function guardarLetra(f, c, letra) {
    const copia = intentos.map((fila) => [...fila])
    copia[f][c] = letra
    setIntentos(copia)
    setAviso('')
  }

  function cambiarLetra(f, c, evento) {
    const letra = evento.target.value.toUpperCase()
    // Solo aceptamos una letra, o nada si se ha borrado
    if (!/^[A-ZÑ]?$/.test(letra)) return
    guardarLetra(f, c, letra)
    // Después de escribir una letra, pasamos a la casilla siguiente
    if (letra !== '') evento.target.nextElementSibling?.focus()
  }

  // Teclado en pantalla: escribe en la primera casilla vacía
  function pulsarTecla(letra) {
    if (terminada) return
    const c = intentos[filaActual].indexOf('')
    if (c !== -1) guardarLetra(filaActual, c, letra)
  }

  // Teclado en pantalla: borra la última letra escrita
  function borrarLetra() {
    if (terminada) return
    const c = intentos[filaActual].findLastIndex((letra) => letra !== '')
    if (c !== -1) guardarLetra(filaActual, c, '')
  }

  function comprobar(evento) {
    // Evita que el navegador recargue la página al enviar el formulario
    evento.preventDefault()
    if (terminada) return
    // No se puede comprobar una fila incompleta
    if (intentos[filaActual].includes('')) {
      setAviso('Faltan letras')
      return
    }
    setFilaActual(filaActual + 1)
  }

  function nuevaPartida() {
    setIntentos(tableroVacio())
    setFilaActual(0)
    setSolucion(palabraAlAzar(solucion))
    setAviso('')
  }

  return (
    <form className="juego" onSubmit={comprobar}>
      <h1>Wordle</h1>
      <div className="tablero">
        {intentos.map((fila, f) => {
          const estados = f < filaActual ? estadosDeFila(fila, solucion) : []
          return (
            <div className="fila" key={f}>
              {fila.map((letra, c) => (
                <Casilla
                  key={c}
                  letra={letra}
                  estado={estados[c] ?? ''}
                  activa={f === filaActual && !terminada}
                  fila={f}
                  columna={c}
                  onCambio={(evento) => cambiarLetra(f, c, evento)}
                />
              ))}
            </div>
          )
        })}
      </div>
      {aviso && (
        <p className="aviso" role="alert">
          {aviso}
        </p>
      )}
      {terminada ? (
        <>
          <p className="mensaje" role="status">
            {ganada
              ? '¡Enhorabuena, has acertado!'
              : `La palabra era ${solucion}`}
          </p>
          <button className="boton" type="button" onClick={nuevaPartida}>
            Nueva partida
          </button>
        </>
      ) : (
        <button className="boton" type="submit">
          Comprobar
        </button>
      )}
      <Teclado
        estados={estadosDelTeclado(intentos, filaActual, solucion)}
        onLetra={pulsarTecla}
        onBorrar={borrarLetra}
      />
    </form>
  )
}

export default App


