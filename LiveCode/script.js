const width = 500;
const height = 500;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background-color", "#1d1d1d");

const cupsCoffee = [3, 2, 1, 2, 0, 1, 1, 2, 3, 6, 9, 5, 5, 1];

// Draw a circle for every datapoint in array

const x = d3.scaleLinear().domain([0, cupsCoffee.length]).range([0, width]);

svg
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x));

const y = d3.scaleLinear().domain([0, cupsCoffee.length]).range([height, 0]);

svg.append("g").call(d3.axisLeft(y));

const circlesCoffee = svg
  .selectAll("circles")
  .data(cupsCoffee)
  .join("circle")
  .attr("cx", (_, i) => {
    return x(i);
  })
  .attr("cy", (_, i) => {
    return y(i);
  })
  .attr("r", (d, i) => d * i)
  .style("fill", "none")
  .attr("stroke", "#f1f1f1")
  .attr("stroke-width", 1);
