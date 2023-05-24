import { randomMap } from "./map.js";
import { randomCourse } from "./course.js";
import { renderCourse, renderMap, getCanvas } from "./render.js";

let location = "forest";
let includeCourse = true;

const generate = () => {
  const width = 500;
  const height = 500;
  const [canvas, context] = getCanvas("canvas", width, height);

  const map = randomMap(width, height, location);

  const course = includeCourse ? randomCourse(width, height, 10, map) : null;

  document.getElementById("map").style.display = "flex";
  renderMap(map, context, canvas);
  if (includeCourse) renderCourse(course, context);

  document.getElementById("canvas").style.display = "block";
  document.getElementById("loader").style.display = "none";
};

const loadMap = () => {
  document.getElementById("canvas").style.display = "none";
  document.getElementById("loader").style.display = "block";
  setTimeout(generate, 0.1);
};

const main = () => {
  document
    .getElementById("terrain-type-dropdown")
    .addEventListener("change", (e) => (location = e.target.value));
  document
    .getElementById("include-course-checkbox")
    .addEventListener("change", (e) => (includeCourse = e.target.checked));
  document
    .getElementById("generate-map-btn")
    .addEventListener("click", loadMap);
  document.body.onload = loadMap;
};

main();
