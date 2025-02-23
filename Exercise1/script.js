const width = window.innerWidth;
const height = window.innerHeight;

// Add <svg> inside canvas
const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g");

const MAX_X = 100;
const MAX_Y = 100;
const MAX_R = 50;

const x = d3.scaleLinear().domain([0, MAX_X]).range([0, width]);
const y = d3.scaleLinear().domain([0, MAX_Y]).range([height, 0]);

// Generates a given number of circles with initial properties
const generateCircles = (numC) => {
  const circles = [...Array(numC)].map(() => {
    const x = 50;
    const y = 50;
    const r = 50;
    return { x, y, r };
  });

  return circles;
};

const generateRects = (numC) => {
  const rects = [...Array(numC)].map(() => {
    const x = 50;
    const y = 50;
    return { x, y };
  });

  return rects;
};

let circles = generateCircles(100);
let rects = generateRects(100);

const circleElements = svg
  .append("g")
  .selectAll("dot")
  .data(circles)
  .join("circle")
  .attr("cx", (c) => x(c.x))
  .attr("cy", (c) => y(c.y))
  .attr("r", (c) => c.r)
  .style("fill", () => `hsl(${Math.random() * 360},100%,50%)`); // Random color

const rectElements = svg
  .append("g")
  .selectAll("rect")
  .data(rects)
  .join("rect")
  .attr("width", 100)
  .attr("height", 100)
  .attr("x", (c) => x(c.x))
  .attr("y", (c) => y(c.y))
  .style("fill", () => `hsl(${Math.random() * 360},100%,50%)`); // Random color

const randomNumBetween = (num) => {
  return Math.floor(Math.random() * num + 1);
};
const updateCircles = () => {
  circleElements
    .data(circles)
    .transition()
    .duration(1000)
    .attr("cx", () => x(randomNumBetween(MAX_X)))
    .attr("cy", () => y(randomNumBetween(MAX_Y)))
    .attr("r", () => randomNumBetween(MAX_R))
    .style("fill", () => `hsl(${Math.random() * 360},100%,50%)`);

  rectElements
    .data(rects)
    .transition()
    .duration(1000)
    .attr("x", () => x(randomNumBetween(MAX_X)))
    .attr("y", () => y(randomNumBetween(MAX_Y)))
    .style("fill", () => `hsl(${Math.random() * 360},100%,50%)`);
};

// Calling updateCircles method every 2 seconds
//d3.interval(updateCircles, 2000);
