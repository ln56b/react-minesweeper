import './Table.css'
import React from 'react'
import Square from './Square'
import { FIELD_STATES } from '../config/constants'

const createFilledTable = (width, height, value) => Array(width).fill(null).map(() => new Array(height).fill(value))

const calculateFieldValue = (x, y, mines) => {
  if (x < 0 || mines.length <= x || y < 0 || mines[0].length <= y) {
    throw new Error('calculateFieldValue: invalid parameters')
  }
  let sum = !!mines[x][y-1] + !!mines[x][y+1]
  if (x !== 0) {
    sum += !!mines[x-1][y-1] + !!mines[x-1][y] + !!mines[x-1][y+1]
  }
  if (x !== mines.length - 1) {
    sum += !!mines[x+1][y-1] + !!mines[x+1][y] + !!mines[x+1][y+1]
  }
  return sum
}

const calculateFieldValues = (width, height, mines) => {
  let fieldValues = createFilledTable(width, height, 0)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      fieldValues[x][y] = calculateFieldValue(x, y, mines)
    }
  }
  return fieldValues
}

let openCellsNumber = 0

function Table({ width, height, mineNumber, mines, endGame, hasFinishedGame }) {
  const [fieldStates, setFieldStates] = React.useState(createFilledTable(width, height, FIELD_STATES.CLOSED))
  const [fieldValues, setFieldValues] = React.useState(createFilledTable(width, height, 0))

  const openArea = ({ fieldStates, fieldValues, x, y }) => {
    if (
      x < 0 || fieldStates.length <= x || y < 0 || fieldStates[0].length <= y
      || fieldStates[x][y] === FIELD_STATES.OPEN
      || fieldStates[x][y] === FIELD_STATES.FLAGGED
    ) {
      return 
    }
    fieldStates[x][y] = FIELD_STATES.OPEN
    openCellsNumber++
    
    if (fieldValues[x][y] > 0) {
      return fieldStates
    }
    for (let x1 of [x-1, x, x+1]) {
      for (let y1 of [y-1, y, y+1]) {
        openArea({ fieldStates, fieldValues, x: x1, y: y1 })
      }
    }
  }

  React.useEffect(() => {
    openCellsNumber = 0
    setFieldStates(createFilledTable(width, height, FIELD_STATES.CLOSED))
    setFieldValues(calculateFieldValues(width, height, mines))
  }, [mines, height, width])

  React.useEffect(() => {
    if (mineNumber + openCellsNumber === height * width) {
      endGame('win')

    }
  }, [openCellsNumber])

  function openField(x,y) {
    if (fieldStates[x][y] === FIELD_STATES.OPEN || fieldStates[x][y] === FIELD_STATES.FLAGGED) {
      return
    }
    let newFieldStates = JSON.parse(JSON.stringify(fieldStates))
    if (mines[x][y]) {
      newFieldStates[x][y] = FIELD_STATES.OPEN
      endGame('lose')
    } else {
      openArea({ fieldStates: newFieldStates, fieldValues, x, y })
    }
    setFieldStates(newFieldStates)
  }

	return (
		<div className="table">
			{
        createFilledTable(width, height, 0).map((column, x) => (
          <div className="table-column" key={x}>
            { (fieldValues.length === width && fieldStates.length === width) &&
              column.map((field, y) => (
                <Square
                  key={`${x.toString()},${y.toString()}`}
                  value={fieldValues[x][y]}
                  isMine={mines[x][y]}
                  state={fieldStates[x][y]}
                  setIsOpen={() => openField(x, y)}
                  isReadonly={hasFinishedGame}
                />
              ))
            }
          </div>
        ))
      }
		</div>
	)
}

export default Table
