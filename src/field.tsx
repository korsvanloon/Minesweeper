import { IField, ITile } from "./types";
import cloneDeep from "lodash/cloneDeep";

// Configuration
export const columns = 10;
export const totalAmountOfTiles = columns * columns;
export const amountOfMines = 15;

/**
 * The user clicked a tile, updated the field:
 * Show the current tile content
 * If not a mine: reveal all adjacent tiles as well (that have no mines)
 */
export function updateField(
  oldField: IField,
  clickedTileId: number,
  setFlag?: boolean
) {
  const field = cloneDeep(oldField);

  // Update the field here.
  const tile = field[clickedTileId];
  tile.flag = setFlag;

  if (setFlag) {
    return field;
  }

  tile.showContent = true;

  if (!tile.mine && !tile.minesAround) {
    sweep(tile, field);
  }

  return field;
}

const sweep = (tile: ITile, field: IField) => {
  const pointsAround = [...getPointsAround(tile)];

  for (const point of pointsAround) {
    const tile = Object.values(field).find(
      (f) => f.x === point.x && f.y === point.y
    );

    if (tile) {
      const x = tile.showContent;
      tile.showContent = true;

      if (!tile?.minesAround && !x) {
        sweep(tile, field);
      }
    }
  }
};

type Point = {
  x: number;
  y: number;
};

function* getPointsAround(point: Point) {
  for (let x = point.x - 1; x <= point.x + 1; x++) {
    for (let y = point.y - 1; y <= point.y + 1; y++) {
      if (
        (x !== point.x || y !== point.y) &&
        x >= 0 &&
        y >= 0 &&
        x < columns &&
        y < columns
      ) {
        yield { x, y };
      }
    }
  }
}

export const generateMineIndexes = () => {
  const indices = new Set();
  while (indices.size !== amountOfMines) {
    indices.add(Math.floor(Math.random() * totalAmountOfTiles));
  }
  return indices;
};

/**
 * Generate the game, based on columns and amountOfMines
 */
export function generateGame() {
  const mineIndexes = generateMineIndexes();

  const newField: IField = Object.fromEntries(
    Array(totalAmountOfTiles)
      .fill(0)
      .map((_, id) => [
        id,
        {
          id,
          x: id % columns,
          y: Math.floor(id / columns),
          mine: mineIndexes.has(id),
          minesAround: 0,
        },
      ])
  );

  const tiles = Object.values(newField);

  for (const tile of tiles) {
    tile.minesAround = [...getPointsAround(tile)]
      .map((x) => tiles.find((t) => t.x === x.x && t.y === x.y)!)
      .filter((x) => x.mine).length;
  }

  return newField;
}
