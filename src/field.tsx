import { IField, ITile } from "./types";
import cloneDeep from "lodash/cloneDeep";
import { isValue } from "./collection";

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
  const tiles = Object.values(field);

  // Update the field here.
  const tile = field[clickedTileId];
  tile.flag = setFlag;

  if (setFlag) {
    return field;
  }

  tile.showContent = true;

  if (!tile.mine && !tile.minesAround) {
    sweep(tile, tiles);
  }

  return field;
}

function sweep(tile: ITile, tiles: ITile[]) {
  for (const adjacentTile of getAdjacentTiles(tile, tiles)) {
    const alreadyVisited = adjacentTile.showContent;

    adjacentTile.showContent = true;

    if (!adjacentTile?.minesAround && !alreadyVisited) {
      sweep(adjacentTile, tiles);
    }
  }
}

const offsets = [-1, 0, 1];

const getAdjacentTiles = (center: ITile, tiles: ITile[]) =>
  // create a list of (x,y) coordinates from (-1,-1) to (1,1)
  offsets
    .flatMap((x) => offsets.map((y) => ({ x, y })))
    // filter out the center (0,0)
    .filter(({ x, y }) => x || y)
    // find corresponding tiles
    .map(({ x, y }) =>
      tiles.find((t) => t.x === center.x + x && t.y === center.y + y)
    )
    // filter out tiles that couldn't be found (out of field bounds)
    .filter(isValue);

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
    // Create array with the size of total tiles
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
    tile.minesAround = getAdjacentTiles(tile, tiles).filter(
      (tile) => tile.mine
    ).length;
  }

  return newField;
}
