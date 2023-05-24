import { blankGrid } from "./util.js";

const perlinNoise = (x, y, unitVectorGrid, frequency) => {
  const x1 = x * frequency;
  const y1 = y * frequency;
  const x0 = Math.floor(x1);
  const y0 = Math.floor(y1);

  const tl = dotProdGrid(x1, y1, x0, y0, unitVectorGrid);
  const tr = dotProdGrid(x1, y1, x0 + 1, y0, unitVectorGrid);
  const bl = dotProdGrid(x1, y1, x0, y0 + 1, unitVectorGrid);
  const br = dotProdGrid(x1, y1, x0 + 1, y0 + 1, unitVectorGrid);

  const xt = interp(x1 - x0, tl, tr);
  const xb = interp(x1 - x0, bl, br);
  const v = interp(y1 - y0, xt, xb);

  return (v + 1) / 2;
};

const randomUnitVector = () =>
  ((theta) => ({
    x: Math.cos(theta),
    y: Math.sin(theta),
  }))(Math.random() * 2 * Math.PI);

const randomUnitVectorGrid = (rows, columns) =>
  blankGrid(rows, columns).map((row) => row.map(() => randomUnitVector()));

const dotProdGrid = (x, y, vert_x, vert_y, unitVectorGrid) => {
  let gVect = unitVectorGrid[vert_x][vert_y];
  let dVect = { x: x - vert_x, y: y - vert_y };
  return dVect.x * gVect.x + dVect.y * gVect.y;
};

const lerp = (x, a, b) => a + x * (b - a);
const smootherStep = (x) => 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
const interp = (x, a, b) => lerp(smootherStep(x), a, b);

const combinedPerlinNoise = (x, y, frequencies, unitVectorGrid) =>
  frequencies.reduce(
    (value, frequency) =>
      value +
      perlinNoise(x, y, unitVectorGrid, frequency.frequency) *
        frequency.strength,
    0
  );

export { combinedPerlinNoise, randomUnitVectorGrid };
