const trianglePath = (control, path, offsetAngle, radius = 20) => {
  path.strokeStyle = "#C5168C";
  path.lineWidth = 2;
  radius = radius * 1.4;
  const cornerCoords = (radius, cornerIndex) => {
    const angle =
      (1 / 3) * (2 * Math.PI) * cornerIndex + Math.PI / 6 - offsetAngle; //+ offsetAngle;
    return [
      radius * Math.cos(angle) + control.x,
      radius * Math.sin(angle) + control.y,
    ];
  };
  path.moveTo(...cornerCoords(radius, 0));
  [1, 2, 0].map((n) => path.lineTo(...cornerCoords(radius, n)));
};
const controlPath = (x, y) => {
  return (control, angle = 0) => {
    const path = new Path2D();
    const type = control.type;
    if (type === "normal" || type === "finish") {
      path.arc(x, y, 20, 0, 2 * Math.PI);
    }
    if (type === "finish") {
      path.arc(x, y, 16, 0, 2 * Math.PI);
    } else if (type === "start") {
      trianglePath(control, path, angle);
    }
    return path;
  };
};
const newControl = (x, y) => ({
  type: "normal",
  x: x,
  y: y,
  path: controlPath(x, y),
});
const randomControl = (width, height) =>
  newControl(Math.random() * width, Math.random() * height);

const controlInWater = (control, map, width, height) =>
  map[Math.floor((control.x / width) * map.length)][
    Math.floor((control.y / height) * map[0].length)
  ].terrain == "water";

const controlOnEdge = (control, width, height) =>
  control.x <= 40 ||
  control.x >= width - 40 ||
  control.y <= 40 ||
  control.y >= height - 40;

const controlCollision = (control1, control2) =>
  ["x", "y"].filter(
    (a) => control1[a] >= control2[a] - 50 && control1[a] <= control2[a] + 50
  ).length > 1;

const controlCollisionExists = (control, controls) =>
  controls.filter((control1) => controlCollision(control, control1)).length;

const validControl = (control, controls, map, width, height) =>
  !controlInWater(control, map, width, height) &&
  !controlCollisionExists(control, controls) &&
  !controlOnEdge(control, width, height);

const controlDistance = (a, b) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const cyclicIndex = (array, i) => {
  i = i % array.length;
  if (i < 0) i += array.length;
  return array[i];
};

const twoOpt = (controls) => {
  let i = 0;
  while (true) {
    ++i;
    let improved = false;

    for (let i = 0; i < controls.length - 2; i++) {
      for (let j = i + 1; j < controls.length - 1; j++) {
        let currDistance =
          controlDistance(controls[i], cyclicIndex(controls, i - 1)) +
          controlDistance(controls[j], cyclicIndex(controls, j + 1));
        let newDistance =
          controlDistance(controls[i], cyclicIndex(controls, j + 1)) +
          controlDistance(controls[j], cyclicIndex(controls, i - 1));

        if (newDistance < currDistance) {
          let section = controls.splice(i, j - i + 1);
          controls.splice(i, 0, ...section.reverse());
          improved = true;
        }
      }
    }

    if (!improved) return controls;
  }
};

const courseWithStartAndFinish = (controls) => [
  { ...controls[0], type: "start" },
  ...controls.splice(1, controls.length - 2),
  { ...controls[controls.length - 1], type: "finish" },
];

const randomCourse = (width, height, length, map) => {
  let controls = [];
  for (let i = 0; i < length - 1; i++) {
    for (let i = 0; i < 1000; i++) {
      const control = randomControl(width, height);
      if (validControl(control, controls, map, width, height)) {
        controls.push(control);
        break;
      }
    }
  }
  return courseWithStartAndFinish(twoOpt(controls));
};

export { randomCourse };
