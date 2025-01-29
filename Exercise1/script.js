// Declaring some properties for the canvas
const margin = { top: 60, right: 30, bottom: 60, left: 70 },
  width = 1738 - margin.left - margin.right,
  height = 850 - margin.top - margin.bottom;

// Add <svg> inside body
const svg = d3
  .select("body")
  .append("svg")
  // When using the width and height properties later this ensures some padding
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const MAX_X = 100;
const MAX_Y = 100;
const MAX_R = 200;

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

let circles = generateCircles(3);

const circleElements = svg
  .append("g")
  .selectAll("dot")
  .data(circles)
  .join("circle")
  .attr("cx", (c) => x(c.x))
  .attr("cy", (c) => y(c.y))
  .attr("r", (c) => c.r)
  .style("fill", () => `hsl(${Math.random() * 360},100%,50%)`); // Random color
