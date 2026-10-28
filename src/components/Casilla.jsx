function Casilla({ letra, estado = '', activa, onCambio }) {
  return (
    <input
      className={`casilla ${estado}`}
      value={letra}
      maxLength={1}
      disabled={!activa}
      onChange={onCambio}
    />
  )
}

export default Casilla
