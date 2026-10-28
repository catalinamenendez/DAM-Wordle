
const NOMBRES = {
  correcta: 'letra correcta',
  presente: 'letra en otra posición',
  ausente: 'letra que no está',
}

function Casilla({ letra, estado = '', activa, fila, columna, onCambio }) {
 
  function teclaPulsada(evento) {
    if (evento.key === 'Backspace' && letra === '') {
      evento.preventDefault()
      evento.target.previousElementSibling?.focus()
    }
  }

  let etiqueta = `Fila ${fila + 1}, columna ${columna + 1}`
  if (estado) etiqueta += `, ${NOMBRES[estado]}`

  return (
    <input
      className={`casilla ${estado}`}
      value={letra}
      maxLength={1}
      disabled={!activa}
      aria-label={etiqueta}
      onChange={onCambio}
      onKeyDown={teclaPulsada}
      onFocus={(evento) => evento.target.select()}
    />
  )
}

export default Casilla

