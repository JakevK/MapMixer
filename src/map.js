import { randomUnitVectorGrid, combinedPerlinNoise } from "./perlin.js";
import { blankGrid } from "./util.js";

const terrains = [
  {
    color: "#FDBF4F",
    level: 0.8,
  },
  {
    color: "#ffffff",
    level: 0.5,
  },
  {
    color: "#A1D3A4",
    level: 0.45,
  },
  {
    color: "#32B457",
    level: 0.35,
  },
];

const closestTerrain = (vegetationLevel, terrains) =>
  terrains.reduce((prev, curr) =>
    Math.abs(curr.level - vegetationLevel) <
    Math.abs(prev.level - vegetationLevel)
      ? curr
      : prev
  );

const cell = (height, vegetationLevel, terrains) =>
  ((terrain) => ({
    height: height,
    runability: terrain.runability,
    terrain: terrain.name,
    color: terrain.color,
  }))(closestTerrain(vegetationLevel, terrains));

const cellWithExtras = (isContour, isWater, x, y, map, cell) => ({
  ...cell,
  runability: isWater ? 0 : cell.runability,
  color: isWater
    ? isWaterEdge(x, y, map)
      ? "#231F20"
      : "#85C3EB"
    : isContour
    ? "#CD7438"
    : cell.color,
  terrain: isWater ? "water" : cell.terrain,
  i: x,
  j: y,
  gScore: Infinity,
});

const newMap = (
  rows,
  columns,
  terrains,
  vegetationFrequencies,
  heightFrequencies,
  vegetationVectorGrid,
  heightVectorGrid
) =>
  blankGrid(rows, columns)
    .map((row, x) =>
      row.map((_cell, y) =>
        cell(
          combinedPerlinNoise(x, y, heightFrequencies, heightVectorGrid),
          combinedPerlinNoise(
            x,
            y,
            vegetationFrequencies,
            vegetationVectorGrid
          ),
          terrains
        )
      )
    )
    .map((row, x, map) =>
      row.map((cell, y) =>
        cellWithExtras(
          isOnContour(map, x, y),
          isWater(map, x, y),
          x,
          y,
          map,
          cell
        )
      )
    );

const locations = {
  forest: {
    vegetations: [
      { frequency: 0.05, strength: 0.09 },
      { frequency: 0.015, strength: 0.5 },
      { frequency: 0.01, strength: 0.4 },
    ],
    heights: [
      { frequency: 0.05, strength: 0.02 },
      { frequency: 0.015, strength: 0.3 },
      { frequency: 0.005, strength: 0.7 },
    ],
  },
  farmland: {
    vegetations: [
      { frequency: 0.05, strength: 0.09 },
      { frequency: 0.015, strength: 0.5 },
      { frequency: 0.01, strength: 0.8 },
    ],
    heights: [
      { frequency: 0.05, strength: 0.02 },
      { frequency: 0.015, strength: 0.03 },
      { frequency: 0.005, strength: 1.2 },
    ],
  },
};

const randomMap = (rows, columns, location) => {
  const vegetationFrequencies = locations[location].vegetations;
  const heightFrequencies = locations[location].heights;
  return newMap(
    rows,
    columns,
    terrains,
    vegetationFrequencies,
    heightFrequencies,
    randomUnitVectorGrid(
      Math.floor(rows * vegetationFrequencies[0].frequency) + 1,
      Math.floor(columns * vegetationFrequencies[0].frequency) + 1
    ),
    randomUnitVectorGrid(
      Math.floor(rows * heightFrequencies[0].frequency + 1),
      Math.floor(columns * heightFrequencies[0].frequency + 1) + 1
    )
  );
};

const isOnContour = (map, x, y, interval = 0.04) =>
  [...Array(Math.floor(1 / interval)).keys()]
    .map((int) => int * interval)
    .filter(
      (height) =>
        map[x][y].height <= height &&
        [
          [-1, 0],
          [0, -1],
          [1, 0],
          [0, 1],
        ].filter(
          ([offsetX, offsetY]) =>
            map[x + offsetX] &&
            map[x + offsetX][y + offsetY] &&
            map[x + offsetX][y + offsetY].height > height
        ).length
    ).length;

const isWater = (map, x, y, threshold = 0.34) => map[x][y].height <= threshold;

const isWaterEdge = (x, y, map, threshold = 0.34) =>
  [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ].filter(
    ([offsetX, offsetY]) =>
      map[x + offsetX] &&
      map[x + offsetX][y + offsetY] &&
      map[x + offsetX][y + offsetY].height > threshold
  ).length;

export { randomMap };
