export const FILAS = 6
export const COLUMNAS = 5

// Palabras de cinco letras, en mayúsculas y sin tildes
export const PALABRAS = [
  'PERRO', 'GATOS', 'PLATO', 'RELOJ', 'MONTE',
  'LIBRO', 'CAMPO', 'NUBES', 'FRESA', 'PIANO',
  'TIGRE', 'VERDE', 'PLAYA', 'CARTA', 'MUNDO',
]

// Crea un tablero vacío: 6 filas de 5 letras en blanco
export function tableroVacio() {
  const tablero = []
  for (let f = 0; f < FILAS; f++) {
    tablero.push(Array(COLUMNAS).fill(''))
  }
  return tablero
}

// Elige una palabra al azar, distinta de la anterior
export function palabraAlAzar(anterior = '') {
  let palabra
  do {
    const i = Math.floor(Math.random() * PALABRAS.length)
    palabra = PALABRAS[i]
  } while (palabra === anterior)
  return palabra
}

// Decide el color de una letra suelta (no tiene en cuenta repeticiones)
export function estadoDe(letra, columna, solucion) {
  if (solucion[columna] === letra) return 'correcta'
  if (solucion.includes(letra)) return 'presente'
  return 'ausente'
}

// Decide los colores de una fila completa, en dos pasadas
export function estadosDeFila(fila, solucion) {
  const estados = Array(fila.length).fill('ausente')
  // Cuántas veces queda disponible cada letra de la solución
  const quedan = {}

  // 1ª pasada: las letras que están en su sitio
  fila.forEach((letra, c) => {
    if (letra === solucion[c]) {
      estados[c] = 'correcta'
    } else {
      quedan[solucion[c]] = (quedan[solucion[c]] ?? 0) + 1
    }
  })

  // 2ª pasada: las demás, mientras queden letras disponibles
  fila.forEach((letra, c) => {
    if (estados[c] !== 'correcta' && quedan[letra] > 0) {
      estados[c] = 'presente'
      quedan[letra]--
    }
  })
  return estados
}

// Mejor estado conocido de cada letra, para colorear el teclado
export function estadosDelTeclado(intentos, filasComprobadas, solucion) {
  const PRIORIDAD = { ausente: 1, presente: 2, correcta: 3 }
  const resultado = {}
  for (let f = 0; f < filasComprobadas; f++) {
    const estados = estadosDeFila(intentos[f], solucion)
    intentos[f].forEach((letra, c) => {
      const anterior = resultado[letra]
      if (!anterior || PRIORIDAD[estados[c]] > PRIORIDAD[anterior]) {
        resultado[letra] = estados[c]
      }
    })
  }
  return resultado
}
