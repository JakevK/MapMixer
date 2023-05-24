const blankGrid = (rows, columns) =>
  Array.from(Array(rows), () => Array.from(Array(columns), () => 0));

export { blankGrid };
