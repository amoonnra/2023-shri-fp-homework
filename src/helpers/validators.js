import { gte, juxt, not, partialRight } from 'ramda'
import { filter } from 'ramda'
import { pipe } from 'ramda'
import { length } from 'ramda'
import { values } from 'ramda'
import { allPass, compose, count, map } from 'ramda'
import { equals, partial, prop } from 'ramda'

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
const isEqualFigure = (color) => partialRight(equals, [color])

const allColors = ['white', 'red', 'orange', 'green', 'blue']
const allFigures = ['star', 'square', 'triangle', 'circle']

const [isWhite, isRed, isOrange, isGreen, isBlue] = map(isEqualFigure, allColors)
const [getStar, getSquare, getTriangle, getCircle] = map(prop, allFigures)
const maxValue = prop('max')(Math)

const figuresWithColorNumber = (colorDefiner) => compose(partial(count, [colorDefiner]), values)
const numberOfFiguresNotColor = (colorDefiner) => (figures) => {
	const allNeededColors = filter(compose(not, colorDefiner), allColors)
	const listOfColoursCount = map(pipe(equals, partialRight(count, [figures])), allNeededColors)
	return maxValue(...listOfColoursCount)
}
const isAllFiguresColor = (colorDefiner) =>
	compose(equalsOfTuple, juxt([compose(length, values), figuresWithColorNumber(colorDefiner)]))

const isNotColorStar = (colorDefiner) => compose(not, colorDefiner, getStar)
const equalsOfTuple = (arr) => equals(arr[0], arr[1])

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
	compose(isWhite, getCircle),
	compose(isWhite, getTriangle),
	compose(isRed, getStar),
	compose(isGreen, getSquare),
])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(partialRight(gte, [2]), figuresWithColorNumber(isGreen))

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(
	equalsOfTuple,
	juxt([figuresWithColorNumber(isRed), figuresWithColorNumber(isBlue)])
)

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
	compose(isBlue, getCircle),
	compose(isRed, getStar),
	compose(isOrange, getSquare),
])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(partialRight(gte, [3]), numberOfFiguresNotColor(isWhite), values)

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
	compose(partial(equals, [2]), figuresWithColorNumber(isGreen)),
	compose(partial(equals, [1]), figuresWithColorNumber(isRed)),
	compose(isGreen, getSquare),
])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = isAllFiguresColor(isOrange)

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass(map(isNotColorStar, [isRed, isWhite]))
// allPass([isNotColorStar(isRed), isNotColorStar(isWhite)])

// 9. Все фигуры зеленые.
export const validateFieldN9 = isAllFiguresColor(isGreen)

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = compose(equalsOfTuple, juxt([getTriangle, getSquare]))
