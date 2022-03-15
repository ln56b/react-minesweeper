import Button from '@mui/material/Button'
import React from 'react'
import Board from './Board'
import Editor from './Editor'
import Timer from './Timer'

const createFilledTable = (width, height, value) =>
	Array(width)
		.fill(null)
		.map(() => new Array(height).fill(value))

const randomInt = (n) => Math.floor(Math.random() * n)

const generateRandomMines = (width, height, mineNumber) => {
	if (!width || !height) {
		throw new Error('generateRandomMines: no width or height given')
	}
	let mines = createFilledTable(width, height, false)
	if (mineNumber === 0) {
		return mines
	}

	let num = 0
	do {
		const x = randomInt(width)
		const y = randomInt(height)
		if (!mines[x][y]) {
			mines[x][y] = true
			num++
		}
	} while (num < mineNumber)
	return mines
}

const testMineNumber = 13
const testWidth = 8
const testHeight = 6
const testMines = generateRandomMines(testWidth, testHeight, testMineNumber)

function Layout() {
	const [mineNumber, setMineNumber] = React.useState(testMineNumber)
	const [height, setHeight] = React.useState(testHeight)
	const [width, setWidth] = React.useState(testWidth)
	const [mines, setMines] = React.useState(testMines)
	const [hasStartedGame, setHasStartedGame] = React.useState(false)
	const [hasFinishedGame, setHasFinishedGame] = React.useState(false)
	const [hasWon, setHasWon] = React.useState(false)
	const [hasOpenedFirstCell, setHasOpenedFirstCell] = React.useState(false)

	function onSubmitForm({
		height: newHeight,
		width: newWidth,
		mines: newMines,
	}) {
		newHeight = Number(newHeight)
		newWidth = Number(newWidth)
		newMines = Number(newMines)
		setHeight(newHeight)
		setWidth(newWidth)
		setMineNumber(newMines)
		setMines(generateRandomMines(newWidth, newHeight, newMines))
		setHasStartedGame(true)
	}

	function onGameEnd(state) {
		if (state === 'win') {
			setHasWon(true)
		} else {
			setHasWon(false)
		}
		setHasFinishedGame(true)
	}

	function resetGame() {
		setMines(() => generateRandomMines(width, height, mineNumber))
		setHasFinishedGame(false)
	}

	function startTimer(openedCell) {
		setHasOpenedFirstCell(openedCell)
	}

	return (
		<React.Fragment>
			<Editor submitForm={onSubmitForm} />
			{hasStartedGame && <div>{mineNumber}</div>}
			{hasStartedGame && (
				<Timer
					hasOpenedFirstCell={hasOpenedFirstCell}
					hasFinishedGame={hasFinishedGame}
				/>
			)}
			<div onClick={() => resetGame()}>😇</div>
			<Board
				width={width}
				height={height}
				mineNumber={mineNumber}
				mines={mines}
				endGame={onGameEnd}
				hasFinishedGame={hasFinishedGame}
				hasOpenedFirstCell={startTimer}
			/>
			{hasFinishedGame && hasWon && <h2>You won ! </h2>}
			{hasFinishedGame && !hasWon && <h2>You lost ! </h2>}
			{hasFinishedGame && (
				<Button variant='contained' type='submit' onClick={() => resetGame()}>
					Play again
				</Button>
			)}
		</React.Fragment>
	)
}

export default Layout
