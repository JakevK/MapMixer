const vectorAngle = (x, y) => Math.atan(x / y) + (y < 0 ? 0 : Math.PI);

const renderLeg = (control1, control2, context, r = 20) => {
  const x = control2.x - control1.x;
  const y = control2.y - control1.y;

  let angle1 = Math.atan(y / x);
  let angle2 = Math.PI / 2 - angle1;

  const s = x < 0 ? -1 : 1;

  const r2 = r;
  const r1 = control1.type === "start" ? r * 1.3 : r;

  const x1 = r1 * Math.cos(angle1) * s;
  const y1 = r1 * Math.sin(angle1) * s;
  const x2 = r2 * Math.sin(angle2) * s;
  const y2 = r2 * Math.cos(angle2) * s;

  context.strokeStyle = "#C5168C";
  context.beginPath();
  context.moveTo(control1.x + x1, control1.y + y1);
  context.lineTo(control2.x - x2, control2.y - y2);
  context.stroke();
};

const renderControl = (control, context, angle) => {
  context.strokeStyle = "#C5168C";
  context.lineWidth = 2;
  context.beginPath();
  context.stroke(control.path(control, angle));
  context.stroke();
};

const renderCell = (terrain, x, y, context, size) => {
  context.fillStyle = terrain.color;
  context.fillRect(x * size, y * size, size, size);
};

const renderMap = (map, context, canvas) =>
  map.map((row, x) =>
    row.map((cell, y) =>
      renderCell(cell, x, y, context, canvas.width / row.length)
    )
  );

const renderCourse = (course, context) =>
  course.map((control, i, course) => {
    if (i) renderLeg(course[i - 1], control, context);
    renderControl(
      control,
      context,
      i
        ? 0
        : vectorAngle(course[i + 1].x - control.x, course[i + 1].y - control.y)
    );
  });

const scaledCanvas = (canvas, width, height) => {
  canvas.width = width;
  canvas.height = height;
  return canvas;
};
const getCanvas = (canvasID, width, height) =>
  ((canvas) => [scaledCanvas(canvas, width, height), canvas.getContext("2d")])(
    document.getElementById(canvasID)
  );

export { renderCourse, renderMap, getCanvas };
