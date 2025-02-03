const width = 800;
const height = 600;
const margin = 50;

const svg = d3
  .select("#canvas")
  .append("svg")
  .attr("width", width + margin * 2)
  .attr("height", height + margin * 2)
  .append("g")
  .attr("transform", `translate(${margin}, ${margin})`);

d3.csv("coffee_energy.csv").then((data) => {
  data.forEach((d) => {
    d.coffeeAmount = +d.coffeeAmount;
    d.energyLevel = +d.energyLevel;
  });
  console.log(data);

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "bold")
    .text("Coffee vs Energy Scatter Plots");

  const maxX = Math.max(...data.map((d) => d.coffeeAmount));

  const xAxis = d3.scaleLinear().domain([0, maxX]).range([0, width]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xAxis));

  const yAxis = d3.scaleLinear().domain([0, 10]).range([height, 0]);

  svg.append("g").call(d3.axisLeft(yAxis));

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "bold")
    .text("Coffee amount (mg)");

  svg
    .append("text")
    .attr("id", "title")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", margin)
    .style("font-size", "20px")
    .style("text-decoration", "bold")
    .text("Energy level");

  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .join("circle")
    .attr("cx", (d) => {
      return xAxis(d.coffeeAmount);
    })
    .attr("cy", (d) => {
      return yAxis(d.energyLevel);
    })
    .attr("r", 5)
    .style("fill", "#ff0000");
});
