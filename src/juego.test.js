import { expect, test } from 'vitest'
import {
  estadoDe, estadosDeFila, estadosDelTeclado,
  palabraAlAzar, tableroVacio, PALABRAS,
} from './juego.js'

test('letra en su sitio', () => {
  expect(estadoDe('P', 0, 'PERRO')).toBe('correcta')
})

test('letra en otra posición', () => {
  expect(estadoDe('O', 0, 'PERRO')).toBe('presente')
})

test('letra que no está en la solución', () => {
  expect(estadoDe('Z', 0, 'PERRO')).toBe('ausente')
})

test('fila acertada: todas correctas', () => {
  expect(estadosDeFila([...'PERRO'], 'PERRO'))
    .toEqual(Array(5).fill('correcta'))
})

test('letras repetidas: RRRRR con PERRO', () => {
  expect(estadosDeFila([...'RRRRR'], 'PERRO')).toEqual(
    ['ausente', 'ausente', 'correcta', 'correcta', 'ausente'])
})

test('letra repetida en otra posición: OOXXX con PERRO', () => {
  expect(estadosDeFila([...'OOXXX'], 'PERRO')).toEqual(
    ['presente', 'ausente', 'ausente', 'ausente', 'ausente'])
})

test('el teclado guarda el mejor estado de cada letra', () => {
  const intentos = [[...'RRRRR'], [...'PLATO']]
  const teclado = estadosDelTeclado(intentos, 2, 'PERRO')
  expect(teclado.R).toBe('correcta')
  expect(teclado.O).toBe('correcta')
  expect(teclado.L).toBe('ausente')
})

test('el tablero vacío tiene 6 filas de 5 casillas', () => {
  const tablero = tableroVacio()
  expect(tablero).toHaveLength(6)
  expect(tablero.every((fila) => fila.join('') === '')).toBe(true)
})

test('la palabra al azar es de la lista y distinta de la anterior', () => {
  const palabra = palabraAlAzar('PERRO')
  expect(PALABRAS).toContain(palabra)
  expect(palabra).not.toBe('PERRO')
})
