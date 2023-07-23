/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import { allPass, andThen, compose, curry, gt, ifElse, length, lt, lte, pipe, prop, tap, test } from 'ramda'
import Api from '../tools/api'

const api = new Api()
const get = curry(prop('get')(api))
const getNumber = get('https://api.tech/numbers/base')
const getAnimal = (id) => get('https://animals.tech/' + id, {})

const greaterThenTwo = compose(lt(2), length)
const lessThenTen = compose(gt(10), length)
const isPositive = compose(lte(0), Number)
const correctSymbols = test(/^[\d.]+$/gi)

const round = prop('round')(Math)

const validate = allPass([greaterThenTwo, lessThenTen, isPositive, correctSymbols])
const validationPipe = (...fns) => ifElse(validate, pipe(...fns), () => Promise.reject('ValidationError'))

const fetchData = (callback) => pipe(callback, andThen(prop('result')))
const fromTenthToBinary = (value) => getNumber({ from: 10, to: 2, number: value })
const sqr = (value) => Math.pow(value, 2)
const del3 = (value) => value % 3

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
	return pipe(
		tap(writeLog),
		validationPipe(pipe(round, tap(writeLog), fetchData(fromTenthToBinary)))
	)(value)
		.then(pipe(tap(writeLog), length, tap(writeLog), sqr, tap(writeLog), del3, tap(writeLog)))
		.then(fetchData(getAnimal))
		.then(handleSuccess)
		.catch(handleError)
}

export default processSequence
