const margin = { top: 50, right: 30, bottom: 40, left: 70 },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    .attr("y", 0 - margin.top / 2)
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
    .attr("r", 10.0)
    .style("fill", "#ff0000");

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width - margin.right * 2)
    .attr("y", height - 20)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "bold")
    .text("Coffee amount (mg)");

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", 20)
    .attr("y", height / 2)
    .style("font-size", "20px")
    .style("text-decoration", "bold")
    .text("Energy level");
});
