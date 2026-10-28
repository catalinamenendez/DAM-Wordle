import { useEffect, useState } from 'react'
import Casilla from './components/Casilla.jsx'

const FILAS = 6
const COLUMNAS = 5
const PALABRAS = [
  'PERRO', 'GATOS', 'PLATO', 'RELOJ', 'MONTE',
  'LIBRO', 'CAMPO', 'NUBES', 'FRESA', 'PIANO',
  'TIGRE', 'VERDE', 'PLAYA', 'CARTA', 'MUNDO',
]


function tableroVacio() {
  const tablero = []
  for (let f = 0; f < FILAS; f++) {
    tablero.push(Array(COLUMNAS).fill(''))
  }
  return tablero
}

function estadoDe(letra, columna, solucion) {
  if (solucion[columna] === letra) return 'correcta'
  if (solucion.includes(letra)) return 'presente'
  return 'ausente'
}

function App() {
  const [intentos, setIntentos] = useState(tableroVacio())
  const [filaActual, setFilaActual] = useState(0)

  const ultimo = filaActual > 0 ? intentos[filaActual - 1].join('') : ''
  const ganada = ultimo === SOLUCION
  const terminada = ganada || filaActual === FILAS

  useEffect(() => {

    document.querySelector('.casilla:enabled')?.focus()
  }, [filaActual])

  function cambiarLetra(f, c, evento) {
    const letra = evento.target.value.toUpperCase()
  
    if (!/^[A-ZÑ]?$/.test(letra)) return

    const copia = intentos.map((fila) => [...fila])
    copia[f][c] = letra
    setIntentos(copia)

    if (letra !== '') evento.target.nextElementSibling?.focus()
  }

 function comprobar(evento) {
  evento.preventDefault()
  if (terminada) return
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

function palabraAlAzar(anterior = '') {
  let palabra
  do {
    const i = Math.floor(Math.random() * PALABRAS.length)
    palabra = PALABRAS[i]
  } while (palabra === anterior)
  return palabra
}


function estadosDeFila(fila, solucion) {
  const estados = Array(fila.length).fill('ausente')

  const quedan = {}

 
  fila.forEach((letra, c) => {
    if (letra === solucion[c]) {
      estados[c] = 'correcta'
    } else {
      quedan[solucion[c]] = (quedan[solucion[c]] ?? 0) + 1
    }
  })

  
  fila.forEach((letra, c) => {
    if (estados[c] !== 'correcta' && quedan[letra] > 0) {
      estados[c] = 'presente'
      quedan[letra]--
    }
  })
  return estados
}



  return (
    <form className="juego" onSubmit={comprobar}>
      <h1>Wordle</h1>
      <div className="tablero">
        {aviso && (
  <p className="aviso" role="alert">
    {aviso}
  </p>
)}

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
      {terminada ? (
  <>
    <p className="mensaje" role="status">
      {ganada
        ? '¡Enhorabuena, has acertado!'
        : `La palabra era ${SOLUCION}`}
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

    </form>
  )
}

export default App
